import { Optional } from '@nestjs/common';

export class User {
  constructor(
    public userName: string,
    public password: string,
    @Optional() public id: string,
  ) {}
}
