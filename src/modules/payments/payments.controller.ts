import { Controller, Headers, Post, Req } from '@nestjs/common';
import { ControllerResponseDto } from 'src/common/base/dtos/response/controller-response.dto';
import { Public } from 'src/common/decorators/public.decorator';
import type { AuthRequest } from 'src/common/interface/auth-request.interface';
import { Stripe } from 'stripe';
import { PaymentsService } from './payments.service';
import { UserDetailsDto } from '../user/dto/responses/user-details.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  async createCheckoutSession(
    @Req() request: AuthRequest,
  ): Promise<ControllerResponseDto> {
    const userId: string = request.userData.sub;

    const customerId: string =
      await this.paymentsService.getOrCreateStripeCustomerIdForUser(userId);
    const session: Stripe.Checkout.Session =
      await this.paymentsService.createCheckoutSession(customerId);

    return { message: 'Checkout session created!', data: { url: session.url } };
  }

  @Public()
  @Post('webhook')
  async handlePaymentWebhook(
    @Req() request: Request,
    @Headers('stripe-signature') signature: string,
  ): Promise<ControllerResponseDto> {
    const userDetails: void | UserDetailsDto =
      await this.paymentsService.handlePaymentWebhook(signature, request);

    return { message: 'Webhook handled successfully!', data: userDetails };
  }
}
