import { IsDefined, IsOptional, IsString, MinLength } from 'class-validator';

export class User {
  @IsString()
  userName: string;

  @IsString()
  @IsDefined()
  @MinLength(6, {
    message: 'Password should be at least 6 characters',
  })
  password: string;

  @IsString()
  @IsOptional()
  id: string;
}
