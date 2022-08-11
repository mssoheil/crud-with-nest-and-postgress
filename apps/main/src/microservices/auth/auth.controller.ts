import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthContoller {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // @MessagePattern({ cmd: 'register' })
  // @EventPattern('register')
  // registerUser(@Body(new AuthValidationPipe()) body: User) {
  //   return this.authService.createUser(body.userName, body.password);
  // }

  @Get('users')
  async getUsers() {
    const users = await this.authService.getAllUsers();
    // return users;
  }

  // @Post('login')
  // loginUser(@Body(new AuthValidationPipe()) body: User) {
  //   return this.authService.loginUser(body.userName, body.password);
  // }
}
