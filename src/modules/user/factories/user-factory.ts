import IBaseFactory from 'src/shared/base/base-factory.interface';
import { User } from '../user.entity';
import { CreateUserDto } from '../dto/requests/create-user.dto';
import { UserDetailsDto } from '../dto/responses/user-datails.dto';
import { UserRole } from '../enums/user-role.enum';
import { Injectable } from '@nestjs/common';
import { UserListDto } from '../dto/responses/user-list.dto';
import { UpdateUserDto } from '../dto/requests/update-user.dto';

@Injectable()
export class UserFactory implements IBaseFactory<
  User,
  CreateUserDto,
  UserDetailsDto,
  UserListDto,
  UpdateUserDto
> {
  createEntityFromDto(dto: CreateUserDto): User {
    const user = new User();

    user.email = dto.email;
    user.password = dto.password;
    user.role = dto.role || UserRole.USER;
    user.stripeCustomerId = dto.stripeCustomerId || '';

    return user;
  }

  createDetailsDtoFromEntity(entity: User): UserDetailsDto {
    const userDetails = new UserDetailsDto();

    userDetails.id = entity.id;
    userDetails.email = entity.email;
    userDetails.role = entity.role;
    userDetails.createdAt = entity.createdAt;
    userDetails.updatedAt = entity.updatedAt;
    userDetails.deletedAt = entity.deletedAt;

    return userDetails;
  }

  createListDtoFromEntities(entities: User[]): UserListDto[] {
    return entities.map((entity) => {
      const userList = new UserListDto();

      userList.id = entity.id;
      userList.email = entity.email;
      userList.role = entity.role;
      userList.createdAt = entity.createdAt;

      return userList;
    });
  }

  createUpdateDtoFromEntity(dto: UpdateUserDto): Partial<User> {
    const updatedData: Partial<User> = {};

    if (dto.email) updatedData.email = dto.email;
    if (dto.password) updatedData.password = dto.password;
    if (dto.role) updatedData.role = dto.role;
    if (dto.isPremium) updatedData.isPremium = dto.isPremium;
    if (dto.stripeCustomerId)
      updatedData.stripeCustomerId = dto.stripeCustomerId;

    return updatedData;
  }
}
