import { UserRole } from '../../enums/user-role.enum';

export class UserListDto {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  deletedAt: Date | null;
}
