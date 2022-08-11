import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthValidationPipe } from './validation.pipe';
import { User } from './auth.dto';
import { UserEntity } from './user.entity';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthContoller {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // @MessagePattern({ cmd: 'register' })
  @EventPattern('register')
  registerUser(@Body(new AuthValidationPipe()) body: User) {
    return this.authService.createUser(body.userName, body.password);
  }

  @EventPattern('get-all-users')
  async getUsers(): Promise<UserEntity[]> {
    const users = await this.authService.getAllUsers();
    return users;
  }

  @Post('login')
  loginUser(@Body(new AuthValidationPipe()) body: User) {
    return this.authService.loginUser(body.userName, body.password);
  }
}
