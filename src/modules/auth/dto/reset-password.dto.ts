import { IsString, Matches, MinLength } from 'class-validator';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  @Matches(passwordRegex, {
    message:
      'The password must contain at least an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*).',
  })
  newPassword: string;
}
