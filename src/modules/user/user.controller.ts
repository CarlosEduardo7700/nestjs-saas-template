import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { BaseController } from 'src/shared/base/base.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UserDetailsDto } from './dto/responses/user-datails.dto';
import { UserListDto } from './dto/responses/user-list.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { ControllerResponseDto } from 'src/shared/base/dtos/response/controller-respose.dto';
import { Public } from 'src/common/decorators/public.decorator';

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

  @Post()
  @Public()
  async create(@Body() dto: CreateUserDto): Promise<ControllerResponseDto> {
    const entityDetails: UserDetailsDto = await this.userService.create(dto);

    return {
      message: 'Created successfully!',
      data: entityDetails,
    };
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ControllerResponseDto> {
    const entityDetails: UserDetailsDto = await this.userService.update(
      id,
      dto,
    );

    return {
      message: `Updated successfully! ID: ${id}`,
      data: entityDetails,
    };
  }
}
