import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(passwordRegex, {
    message:
      'The password must contain at least an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*).',
  })
  password: string;
}
