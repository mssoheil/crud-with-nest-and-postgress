import { Body, Controller, Get, Post } from '@nestjs/common';
import type { User } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthContoller {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(
    @Body('userName') userName: string,
    @Body('password') password: string,
  ) {
    return this.authService.createUser(userName, password);
  }

  @Get('users')
  getUsers(): User[] {
    return this.authService.getAllUsers();
  }

  @Post('login')
  loginUser(
    @Body('userName') userName: string,
    @Body('password') password: string,
  ) {
    return this.authService.loginUser(userName, password);
  }
}
