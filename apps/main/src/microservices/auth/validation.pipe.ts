import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
// Types
import type { User } from './dtos/auth.dto';

@Injectable()
export class AuthValidationPipe implements PipeTransform {
	async transform(value: User, { metatype }: ArgumentMetadata) {
		const object = plainToInstance(metatype, value);
		const errors = await validate(object);

		if (errors?.length) {
			const constraints = errors.map((item) => item.constraints);
			const messages = errors.map((item) => Object.values(item.constraints));

			throw new HttpException(
				{
					message: messages[0].join('. '),
					constraints,
				},
				HttpStatus.BAD_REQUEST,
			);
		}

		return value;
	}
}
