import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PaymentsService {
  public stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const secretKey: string | undefined =
      this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!secretKey) {
      throw new Error('Stripe secret key is not configured!');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2026-02-25.clover',
    });
  }

  async getOrCreateStripeCustomerIdForUser(userId: string): Promise<string> {
    const user: User | null =
      await this.userService.getUserByIdForPayment(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

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
          price: this.configService.get<string>('STRIPE_PRODUCT_ID='),
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get<string>(
        'FRONTEND_URL',
      )}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get<string>(
        'FRONTEND_URL',
      )}/payment-cancelled`,
      metadata: { customerId },
    });
  }
}
