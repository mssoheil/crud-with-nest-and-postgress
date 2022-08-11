import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// Utilities
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private users: Repository<UserEntity>,
  ) {}

  private async handleUserHasConflict(userName: string) {
    const userDoesExist = await this.isUserExist(userName);

    if (userDoesExist) {
      throw new ConflictException('The user exists');
    }
  }

  private async handleUserNotFound(userName: string) {
    const userIsExist = await this.isUserExist(userName);

    if (!userIsExist) {
      throw new UnauthorizedException('The userName or password is wrong');
    }
  }

  private async isUserExist(userName: string): Promise<boolean> {
    const user = await this.findUserByUserName(userName);

    return !!user;
  }

  private async findUserByUserName(userName: string): Promise<UserEntity> {
    try {
      const user = await this.users.findOneBy({ userName });

      return user;
    } catch (error) {
      console.log('DEBUG -> AuthService -> findUserByUserName -> error', error);
      return;
    }
  }

  private createAccessToken(user: UserEntity) {
    const userWithoutPassword = {
      userName: user.userName,
      id: user.id,
    };

    const accessToken = jwt.sign(
      userWithoutPassword,
      process.env.ACCESS_TOKEN_SECRET_KEY,
    );

    return accessToken;
  }

  private async handlePasswordNotMatched(user: UserEntity, password: string) {
    const passwordDoesMatch = await bcrypt.compare(password, user.password);

    if (!passwordDoesMatch) {
      throw new UnauthorizedException('The userName or password is wrong');
    }
  }

  async createUser(userName: string, password: string) {
    try {
      await this.handleUserHasConflict(userName);

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser: UserEntity = {
        userName,
        password: hashedPassword,
      };

      await this.users.save(newUser);
      return 'User created';
    } catch (error) {
      console.log('DEBUG -> AuthService -> createUser -> error', error);
      return;
    }
  }

  getAllUsers(): Promise<UserEntity[]> {
    try {
      console.log('HERE');
      return this.users.find();
    } catch (error) {
      console.log('DEBUG -> AuthService -> getAllUsers -> error', error);
      return;
    }
  }

  async loginUser(userName: string, password: string) {
    try {
      await this.handleUserNotFound(userName);

      const user = await this.findUserByUserName(userName);

      await this.handlePasswordNotMatched(user, password);

      const accessToken = this.createAccessToken(user);

      return { accessToken };
    } catch (error) {
      console.log('DEBUG -> AuthService -> loginUser -> error', error);
    }
  }
}
