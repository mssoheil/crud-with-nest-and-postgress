import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthValidationPipe } from './validation.pipe';
import { User } from './auth.dto';

@Controller('auth')
export class AuthContoller {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body(new AuthValidationPipe()) body: User) {
    return this.authService.createUser(body.userName, body.password);
  }

  @Get('users')
  getUsers(): User[] {
    return this.authService.getAllUsers();
  }

  @Post('login')
  loginUser(@Body(new AuthValidationPipe()) body: User) {
    return this.authService.loginUser(body.userName, body.password);
  }
}
