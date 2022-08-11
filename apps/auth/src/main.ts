import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'auth-consumer',
        },
      },
    },
  );
  // app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen();
}
bootstrap();
