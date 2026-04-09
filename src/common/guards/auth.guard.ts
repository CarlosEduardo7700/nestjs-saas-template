import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { AuthRequest } from '../interface/auth-request.interface';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { UserService } from 'src/modules/core/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.verifyIsPublic(context);

    if (isPublic) return true;

    const request: AuthRequest = context
      .switchToHttp()
      .getRequest<AuthRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('No token provided.');

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      const user = await this.userService.validateUserForAuth(payload.sub);

      if (!user || user.deletedAt) {
        throw new UnauthorizedException('User no longer exists.');
      }

      request.userData = {
        sub: user.id,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.warn(`Token verification failed: ${error}`);
      throw new UnauthorizedException('Invalid or expired token.');
    }

    return true;
  }

  private extractTokenFromHeader(request: AuthRequest): string | undefined {
    const [accessTokenType, token] =
      request.headers.authorization?.split(' ') ?? [];
    return accessTokenType === 'Bearer' ? token : undefined;
  }

  private verifyIsPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
