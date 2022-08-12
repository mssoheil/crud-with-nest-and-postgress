import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthContoller } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [AuthContoller],
	providers: [AuthService],
})
export class AuthModule {}
