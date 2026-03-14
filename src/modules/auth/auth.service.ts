import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user: User | null = await this.userService.getUserByEmailForAuth(
      loginDto.email,
    );

    if (!user || !(await bcrypt.compare(loginDto.password, user.password)))
      throw new UnauthorizedException('Invalid email or password!');

    return 'fake-jwt-token';
  }
}
