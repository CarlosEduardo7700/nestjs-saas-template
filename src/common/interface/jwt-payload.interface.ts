import { UserRole } from 'src/modules/user/enums/user-role.enum';

export interface JwtPayload {
  email: string;
  sub: string;
  role: UserRole;
}
