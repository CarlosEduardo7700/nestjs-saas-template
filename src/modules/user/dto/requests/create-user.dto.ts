import { UserRole } from '../../enums/user-role.enum';

export class CreateUserDto {
  email: string;
  password: string;
  role?: UserRole;
  stripeCustomerId?: string;
}
