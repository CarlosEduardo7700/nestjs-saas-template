import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/base/base.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UserDetailsDto } from './dto/responses/user-datails.dto';
import { UserFactory } from './factories/user-factory';

@Injectable()
export class UserService extends BaseService<
  User,
  CreateUserDto,
  UserDetailsDto
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userFactory: UserFactory,
  ) {
    super(userRepository, userFactory);
  }
}
