import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/base/base.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';
import { UserFactory } from './factories/user-factory';
import { UserListDto } from './dto/responses/user-list.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';

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
      select: ['id', 'password', 'email', 'role'],
    });
    return user;
  }
}
