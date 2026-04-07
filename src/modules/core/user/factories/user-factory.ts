import IBaseFactory from 'src/common/base/base-factory.interface';
import { User } from '../user.entity';
import { CreateUserDto } from '../dto/requests/create-user.dto';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { Injectable } from '@nestjs/common';
import { UserListDto } from '../dto/responses/user-list.dto';
import { UpdateUserDto } from '../dto/requests/update-user.dto';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { defineRole } from '../enums/user-role.enum';
import { AdminUpdateUserDto } from '../dto/requests/admin-update-user.dto';

@Injectable()
export class UserFactory implements IBaseFactory<
  User,
  CreateUserDto,
  UserDetailsDto,
  UserListDto,
  UpdateUserDto
> {
  private saltRounds: number;

  constructor(private configService: ConfigService) {
    this.saltRounds =
      Number(this.configService.get<number>('SALT_ROUNDS')) || 10;
  }

  async createEntityFromDto(dto: CreateUserDto): Promise<User> {
    const user = new User();

    user.name = dto.name;
    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, this.saltRounds);
    user.role = defineRole();

    return user;
  }

  createDetailsDtoFromEntity(entity: User): UserDetailsDto {
    const userDetails = new UserDetailsDto();

    userDetails.id = entity.id;
    userDetails.name = entity.name;
    userDetails.email = entity.email;
    userDetails.role = entity.role;
    userDetails.isPremium = entity.isPremium;
    userDetails.createdAt = entity.createdAt;
    userDetails.updatedAt = entity.updatedAt;
    userDetails.deletedAt = entity.deletedAt;

    return userDetails;
  }

  createListDtoFromEntities(entities: User[]): UserListDto[] {
    return entities.map((entity) => {
      const userList = new UserListDto();

      userList.id = entity.id;
      userList.name = entity.name;
      userList.email = entity.email;
      userList.isPremium = entity.isPremium;
      userList.role = entity.role;
      userList.createdAt = entity.createdAt;

      return userList;
    });
  }

  async createUpdatedEntityFromDto(
    dto: UpdateUserDto | AdminUpdateUserDto,
  ): Promise<Partial<User>> {
    const updatedData: Partial<User> = {};

    if (dto.name) updatedData.name = dto.name;
    if (dto.email) updatedData.email = dto.email;
    if (dto.password) {
      updatedData.password = await bcrypt.hash(dto.password, this.saltRounds);
      updatedData.passwordResetToken = null;
      updatedData.passwordResetExpires = null;
    }

    if ('isPremium' in dto) updatedData.isPremium = dto.isPremium;
    if ('paymentCustomerId' in dto)
      updatedData.paymentCustomerId = dto.paymentCustomerId;
    if ('passwordResetToken' in dto)
      updatedData.passwordResetToken = dto.passwordResetToken;
    if ('passwordResetExpires' in dto)
      updatedData.passwordResetExpires = dto.passwordResetExpires;
    if ('role' in dto) updatedData.role = dto.role;

    return updatedData;
  }
}
