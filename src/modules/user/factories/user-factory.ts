import IBaseFactory from 'src/common/base/base-factory.interface';
import { User } from '../user.entity';
import { CreateUserDto } from '../dto/requests/create-user.dto';
import { UserDetailsDto } from '../dto/responses/user-details.dto';
import { UserRole } from '../enums/user-role.enum';
import { Injectable } from '@nestjs/common';
import { UserListDto } from '../dto/responses/user-list.dto';
import { UpdateUserDto } from '../dto/requests/update-user.dto';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

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

    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, this.saltRounds);
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

  async createUpdateDtoFromEntity(dto: UpdateUserDto): Promise<Partial<User>> {
    const updatedData: Partial<User> = {};

    if (dto.email) updatedData.email = dto.email;
    if (dto.password)
      updatedData.password = await bcrypt.hash(dto.password, this.saltRounds);
    if (dto.isPremium !== undefined) updatedData.isPremium = dto.isPremium;
    if (dto.stripeCustomerId)
      updatedData.stripeCustomerId = dto.stripeCustomerId;

    return updatedData;
  }
}
