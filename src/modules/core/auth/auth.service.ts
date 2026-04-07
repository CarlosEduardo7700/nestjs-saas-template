import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { JwtPayload } from '../../../common/interface/jwt-payload.interface';
import { EmailService } from '../email/email.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AdminUpdateUserDto } from '../user/dto/requests/admin-update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user: User | null = await this.userService.getUserByEmailForAuth(
      loginDto.email,
    );

    if (!user || !(await bcrypt.compare(loginDto.password, user.password)))
      throw new UnauthorizedException('Invalid email or password!');

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user: User | null = await this.userService.getUserByEmail(
      forgotPasswordDto.email,
    );

    if (!user) return;

    const resetToken: string = crypto.randomBytes(32).toString('hex');
    const hashedToken: string = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const resetExpires: Date = new Date(Date.now() + 60 * 60 * 1000);

    await this.userService.update(user.id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: resetExpires,
    } as AdminUpdateUserDto);

    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const hashedToken: string = crypto
      .createHash('sha256')
      .update(resetPasswordDto.token)
      .digest('hex');

    const user: User | null =
      await this.userService.getUserByResetToken(hashedToken);

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.userService.updatePassword(
      user.id,
      resetPasswordDto.newPassword,
    );

    await this.emailService.sendPasswordResetSuccessEmail(user.email);
  }
}
