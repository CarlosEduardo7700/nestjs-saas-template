import { Column, Entity } from 'typeorm';
import { UserRole } from './enums/user-role.enum';
import { BaseEntity } from 'src/shared/base/base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'email', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ name: 'password', length: 100, nullable: false, select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ nullable: true })
  stripeCustomerId: string;
}
