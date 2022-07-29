import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { format } from 'date-fns';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const now = new Date();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, body } = request;
    const { statusCode } = response;

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `request: ${method} to ${url} with the body ${JSON.stringify(
              body,
            )} at ${format(
              now,
              'yyyy-MM-dd HH:mm:ss',
            )} -> response with statusCode of ${statusCode}`,
          ),
        ),
      );
  }
}
