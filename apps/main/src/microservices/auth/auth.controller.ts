import { Controller, Get, Inject, OnModuleInit, Req, Res } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthContoller implements OnModuleInit {
	constructor(
		private readonly authService: AuthService,
		@Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
	) {}

	// @Post('register')
	// @MessagePattern({ cmd: 'register' })
	// @EventPattern('register')
	// registerUser(@Body(new AuthValidationPipe()) body: User) {
	//   return this.authService.createUser(body.userName, body.password);
	// }

	@Get('users')
	async getUsers(@Res() response: any) {
		const users = await this.authService.getAllUsers(response);
		return users;
	}

	// @Post('login')
	// loginUser(@Body(new AuthValidationPipe()) body: User) {
	//   return this.authService.loginUser(body.userName, body.password);
	// }

	onModuleInit() {
		this.authClient.subscribeToResponseOf('get-all-users');
	}
}
