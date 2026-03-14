import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ControllerResponseDto } from 'src/shared/base/dtos/response/controller-respose.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<ControllerResponseDto> {
    const token: LoginResponseDto = await this.authService.login(loginDto);

    return {
      message: 'Login successful!',
      data: token,
    };
  }
}
