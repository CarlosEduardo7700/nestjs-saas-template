import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRequest } from '../interface/auth-request.interface';
import { IS_PREMIUM_KEY } from '../decorators/premium.decorator';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiresPremium = this.reflector.getAllAndOverride<boolean>(
      IS_PREMIUM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiresPremium) return true;

    const request: AuthRequest = context
      .switchToHttp()
      .getRequest<AuthRequest>();

    const user = request.userData;

    if (!user) return false;

    if (user.isPremium) return true;

    throw new ForbiddenException(
      'Access restricted. Subscribe to Pro plan to use this feature.',
    );
  }
}
