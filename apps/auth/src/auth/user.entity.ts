import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  userName: string;

  @Column()
  password: string;
}
