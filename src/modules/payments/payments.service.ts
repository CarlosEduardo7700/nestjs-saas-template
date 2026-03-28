import {
  BadRequestException,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UserDetailsDto } from '../user/dto/responses/user-details.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PaymentsService {
  public stripe: Stripe;
  private endpointSecret: string;

  constructor(
    private configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const secretKey: string | undefined =
      this.configService.get<string>('STRIPE_SECRET_KEY');
    const endpointSecret: string | undefined = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!secretKey) throw new Error('Stripe secret key is not configured!');
    if (!endpointSecret)
      throw new Error('Stripe webhook secret is not configured!');

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2026-02-25.clover',
    });
    this.endpointSecret = endpointSecret;
  }

  async getOrCreateStripeCustomerIdForUser(userId: string): Promise<string> {
    const user: User = await this.userService.getUserByIdForPayment(userId);

    if (user?.stripeCustomerId) return user.stripeCustomerId;

    const customer: Stripe.Response<Stripe.Customer> =
      await this.stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });

    await this.userService.update(user.id, {
      stripeCustomerId: customer.id,
    });

    return customer.id;
  }

  createCheckoutSession(customerId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: this.configService.get<string>('STRIPE_PRICE_ID'),
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get<string>('FRONTEND_URL')}/payment-successful`,
      cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/payment-cancelled`,
      metadata: { customerId },
    });
  }

  async handlePaymentWebhook(
    signature: string,
    request: RawBodyRequest<Request>,
  ): Promise<UserDetailsDto | void> {
    const event: Stripe.Event = this.validationWebhookSignature(
      signature,
      this.endpointSecret,
      request,
    );

    if (event.type === 'checkout.session.completed') {
      const session: Stripe.Checkout.Session = event.data.object;
      const customerId: string = session.customer as string;

      return await this.userService.updateByCustomerId(customerId, {
        isPremium: true,
      });
    }
  }

  validationWebhookSignature(
    signature: string,
    endpointSecret: string,
    request: RawBodyRequest<Request>,
  ): Stripe.Event {
    if (!request.rawBody)
      throw new BadRequestException('Missing raw body for webhook validation');

    try {
      return this.stripe.webhooks.constructEvent(
        request.rawBody,
        signature,
        endpointSecret,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new BadRequestException(`Invalid webhook signature: ${message}`);
    }
  }
}
