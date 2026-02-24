import IBaseFactory from 'src/shared/base/base-factory.interface';
import { User } from '../user.entity';
import { CreateUserDto } from '../dto/requests/create-user.dto';
import { UserDetailsDto } from '../dto/responses/user-datails.dto';
import { UserRole } from '../enums/user-role.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserFactory implements IBaseFactory<
  User,
  CreateUserDto,
  UserDetailsDto
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
}
