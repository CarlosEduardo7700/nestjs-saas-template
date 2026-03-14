import { Body, Controller, Patch, Post, Req } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { BaseController } from 'src/shared/base/base.controller';
import { ControllerResponseDto } from 'src/shared/base/dtos/response/controller-respose.dto';
import type { AuthRequest } from '../auth/interface/auth-request.interface';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { UserDetailsDto } from './dto/responses/user-datails.dto';
import { UserListDto } from './dto/responses/user-list.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

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

  @Patch()
  async update(
    @Req() request: AuthRequest,
    @Body() dto: UpdateUserDto,
  ): Promise<ControllerResponseDto> {
    const id: string = request.userData.sub;
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
