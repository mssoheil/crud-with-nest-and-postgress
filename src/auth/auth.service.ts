import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// Utilities
import * as bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import type { User } from './auth.dto';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  users: User[] = [];

  private handleBadRequest(userName: string, password: string) {
    if (!userName || !password) {
      throw new BadRequestException('Provide userName and password');
    }
  }

  private handleUserHasConflict(userName: string) {
    if (this.isUserExist(userName)) {
      throw new ConflictException('The user exists');
    }
  }

  private handleUserNotFound(userName: string) {
    const userIsExist = this.isUserExist(userName);

    if (!userIsExist) {
      throw new UnauthorizedException('The userName or password is wrong');
    }
  }

  private isUserExist(userName: string): boolean {
    return !!this.findUserByUserName(userName);
  }

  private findUserByUserName(userName: string): User | null {
    const user = this.users.find((item: User) => item.userName === userName);
    if (!user) {
      return null;
    }
    return user;
  }

  private createAccessToken(user: User) {
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

  private async handlePasswordNotMatched(user: User, password: string) {
    const passwordDoesMatch = await bcrypt.compare(password, user.password);

    if (!passwordDoesMatch) {
      throw new UnauthorizedException('The userName or password is wrong');
    }
  }

  async createUser(userName: string, password: string) {
    this.handleBadRequest(userName, password);

    this.handleUserHasConflict(userName);

    if (this.isUserExist(userName)) {
      throw new ConflictException('The user exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidV4();

    const newUser: User = {
      userName,
      password: hashedPassword,
      id,
    };

    this.users.push(newUser);
    return 'User created';
  }

  getAllUsers(): User[] {
    return [...this.users.map((item) => item)];
  }

  async loginUser(userName: string, password: string) {
    this.handleBadRequest(userName, password);

    this.handleUserNotFound(userName);

    const user = this.findUserByUserName(userName);

    this.handlePasswordNotMatched(user, password);

    const accessToken = this.createAccessToken(user);

    return { accessToken };
  }
}
