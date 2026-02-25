import { Controller } from '@nestjs/common';
import { BaseController } from 'src/shared/base/base.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UserDetailsDto } from './dto/responses/user-datails.dto';
import { UserListDto } from './dto/responses/user-list.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';

@Controller('user')
export class UserController extends BaseController<
  User,
  CreateUserDto,
  UserDetailsDto,
  UserListDto,
  UpdateUserDto
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
