import { UserRole } from 'src/modules/core/user/enums/user-role.enum';

export interface JwtPayload {
  email: string;
  sub: string;
  role: UserRole;
  isPremium: boolean;
}
