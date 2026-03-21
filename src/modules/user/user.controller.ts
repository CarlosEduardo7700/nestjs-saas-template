import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { BaseController } from 'src/shared/base/base.controller';
import { ControllerResponseDto } from 'src/shared/base/dtos/response/controller-response.dto';
import type { AuthRequest } from '../auth/interface/auth-request.interface';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { UserDetailsDto } from './dto/responses/user-details.dto';
import { UserListDto } from './dto/responses/user-list.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';

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

  @Patch('me')
  async updateProfile(
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

  @Patch(':id')
  @Roles(UserRole.ADMIN)
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

  @Get('me')
  async getMyData(@Req() request: AuthRequest): Promise<ControllerResponseDto> {
    const id: string = request.userData.sub;
    const entityDetails: UserDetailsDto = await this.userService.findById(id);

    return {
      message: `Retrieved successfully! ID: ${id}`,
      data: entityDetails,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findById(@Param('id') id: string): Promise<ControllerResponseDto> {
    const entityDetails: UserDetailsDto = await this.userService.findById(id);

    return {
      message: `Retrieved successfully! ID: ${id}`,
      data: entityDetails,
    };
  }

  @Delete('me')
  async deleteMyData(
    @Req() request: AuthRequest,
  ): Promise<ControllerResponseDto> {
    const id: string = request.userData.sub;
    await this.userService.deleteById(id);

    return {
      message: `Deleted successfully! ID: ${id}`,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteById(@Param('id') id: string): Promise<ControllerResponseDto> {
    await this.userService.deleteById(id);

    return {
      message: `Deleted successfully! ID: ${id}`,
    };
  }
}
