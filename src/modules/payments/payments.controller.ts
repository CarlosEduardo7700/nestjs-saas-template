import { Controller, Post, Req } from '@nestjs/common';
import { ControllerResponseDto } from 'src/common/base/dtos/response/controller-response.dto';
import type { AuthRequest } from 'src/common/interface/auth-request.interface';
import { PaymentsService } from './payments.service';
import { Stripe } from 'stripe';

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
}
