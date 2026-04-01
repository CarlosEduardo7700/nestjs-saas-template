import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ControllerResponseDto } from 'src/common/base/dtos/response/controller-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @Public()
  @ApiOperation({ summary: 'Authenticate user and get JWT token' })
  @Throttle({
    short: { ttl: 1000, limit: 1 },
    medium: { ttl: 60000, limit: 5 },
    long: { ttl: 3600000, limit: 20 },
  })
  async login(@Body() loginDto: LoginDto): Promise<ControllerResponseDto> {
    const token: LoginResponseDto = await this.authService.login(loginDto);

    return {
      message: 'Login successful!',
      data: token,
    };
  }

  @Post('/forgot-password')
  @Public()
  @ApiOperation({ summary: 'Request password reset email' })
  @Throttle({
    short: { ttl: 1000, limit: 1 },
    medium: { ttl: 60000, limit: 3 },
    long: { ttl: 3600000, limit: 5 },
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ControllerResponseDto> {
    await this.authService.forgotPassword(forgotPasswordDto);

    return {
      message:
        'If an account with that email exists, a password reset link has been sent.',
    };
  }

  @Post('/reset-password')
  @Public()
  @ApiOperation({ summary: 'Reset password with token' })
  @Throttle({
    short: { ttl: 1000, limit: 1 },
    medium: { ttl: 60000, limit: 5 },
    long: { ttl: 3600000, limit: 10 },
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ControllerResponseDto> {
    await this.authService.resetPassword(resetPasswordDto);

    return {
      message: 'Password has been reset successfully!',
    };
  }
}
