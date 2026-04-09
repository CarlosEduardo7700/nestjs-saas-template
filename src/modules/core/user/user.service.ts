import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/base.service';
import { MoreThan, Repository } from 'typeorm';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';
import { UserListDto } from './dto/responses/user-list.dto';
import { UserFactory } from './factories/user-factory';
import { User } from './user.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService extends BaseService<
  User,
  CreateUserDto,
  UserDetailsDto,
  UserListDto,
  UpdateUserDto
> {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userFactory: UserFactory,
    private readonly emailService: EmailService,
  ) {
    super(userRepository, userFactory);
  }

  async create(dto: CreateUserDto): Promise<UserDetailsDto> {
    const entityDetails: UserDetailsDto = await super.create(dto);

    this.emailService.sendWelcomeEmail(entityDetails.email).catch((error) => {
      this.logger.error('Failed to send welcome email:', error);
    });

    return entityDetails;
  }

  async getUserByEmailForAuth(email: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'password', 'email', 'role', 'isPremium'],
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async getUserByIdForPayment(userId: string): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'paymentCustomerId'],
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getUserByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: MoreThan(new Date()),
      },
      select: ['id', 'email', 'passwordResetToken', 'passwordResetExpires'],
    });
  }

  async updateByCustomerId(
    customerId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDetailsDto> {
    const user: User | null = await this.userRepository.findOne({
      where: { paymentCustomerId: customerId },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.update(user.id, updateUserDto);
  }

  async validateUserForAuth(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'role', 'isPremium', 'deletedAt'],
      withDeleted: true,
    });
  }
}
