import { UserRole } from '../../enums/user-role.enum';

export class UserListDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isPremium?: boolean;
  createdAt: Date;
}
