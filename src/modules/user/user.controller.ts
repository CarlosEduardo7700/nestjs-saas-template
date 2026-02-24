import { Controller } from '@nestjs/common';
import { BaseController } from 'src/shared/base/base.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UserDetailsDto } from './dto/responses/user-datails.dto';
import { UserListDto } from './dto/responses/user-list.dto';

@Controller('user')
export class UserController extends BaseController<
  User,
  CreateUserDto,
  UserDetailsDto,
  UserListDto
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
