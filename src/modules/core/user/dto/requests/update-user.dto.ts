import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @IsOptional()
  @IsString()
  passwordResetToken?: string | null;

  @IsOptional()
  @IsDate()
  passwordResetExpires?: Date | null;
}
