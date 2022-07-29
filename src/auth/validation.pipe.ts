import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
// Types
import type { User } from './auth.dto';

@Injectable()
export class AuthValidationPipe implements PipeTransform {
  transform(value: User) {
    if (!value.userName || !value.password) {
      throw new BadRequestException('Provide userName and password');
    }
    return value;
  }
}
