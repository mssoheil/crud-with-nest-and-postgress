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
  async createUser(userName: string, password: string) {
    if (!userName || !password) {
      throw new BadRequestException('Provide the userName and password');
    }

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

  isUserExist(userName: string): boolean {
    return !!this.findUserByUserName(userName);
  }

  findUserByUserName(userName: string): User | null {
    const user = this.users.find((item: User) => item.userName === userName);
    if (!user) {
      return null;
    }
    return user;
  }

  getAllUsers(): User[] {
    return [...this.users.map((item) => item)];
  }

  async loginUser(userName: string, password: string) {
    if (!userName || !password) {
      throw new BadRequestException('Provide userName and password');
    }

    const userIsExist = this.isUserExist(userName);

    if (!userIsExist) {
      throw new UnauthorizedException('The userName or password is wrong');
    }

    const user = this.findUserByUserName(userName);

    const passwordDoesMatch = await bcrypt.compare(password, user.password);

    if (!passwordDoesMatch) {
      throw new UnauthorizedException('The userName or password is wrong');
    }

    const userWithoutPassword = {
      userName: user.userName,
      id: user.id,
    };

    const accessToken = jwt.sign(
      userWithoutPassword,
      process.env.ACCESS_TOKEN_SECRET_KEY,
    );

    return { accessToken };
  }
}
