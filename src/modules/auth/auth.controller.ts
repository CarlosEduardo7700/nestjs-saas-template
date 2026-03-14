import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ControllerResponseDto } from 'src/shared/base/dtos/response/controller-respose.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<ControllerResponseDto> {
    const token: string = await this.authService.login(loginDto);

    return {
      message: 'Login successful!',
      data: token,
    };
  }
}
