import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { UserEntity } from './auth/user.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESS_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRESS_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRESS_DATABASE,
      entities: [UserEntity],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
