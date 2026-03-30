import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/base.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';
import { UserListDto } from './dto/responses/user-list.dto';
import { UserFactory } from './factories/user-factory';
import { User } from './user.entity';

@Injectable()
export class UserService extends BaseService<
  User,
  CreateUserDto,
  UserDetailsDto,
  UserListDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userFactory: UserFactory,
  ) {
    super(userRepository, userFactory);
  }

  async getUserByEmailForAuth(email: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'password', 'email', 'role', 'isPremium'],
    });
    return user;
  }

  async getUserByIdForPayment(userId: string): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'stripeCustomerId'],
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateByCustomerId(
    customerId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDetailsDto> {
    const user: User | null = await this.userRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.update(user.id, updateUserDto);
  }
}
