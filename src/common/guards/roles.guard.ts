import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/user/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request: AuthRequest = context
      .switchToHttp()
      .getRequest<AuthRequest>();

    const userRole: UserRole = request.userData?.role;

    if (!userRole || !requiredRoles.includes(userRole))
      throw new UnauthorizedException('Insufficient permissions.');

    return true;
  }
}
