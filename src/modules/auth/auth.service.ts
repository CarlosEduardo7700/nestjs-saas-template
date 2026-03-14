import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user: User | null = await this.userService.getUserByEmail(
      loginDto.email,
    );

    if (!user) throw new UnauthorizedException('Invalid credentials!');

    return 'fake-jwt-token';
  }
}
