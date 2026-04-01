import { UserRole } from '../../enums/user-role.enum';

export class UserDetailsDto {
  id: string;
  email: string;
  role: UserRole;
  isPremium?: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
