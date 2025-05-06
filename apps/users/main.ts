import { NestFactory } from '@nestjs/core';
import { UsersModule } from './src/users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  app.use(morgan('dev'));
  app.enableCors({
    origin: 'http://localhost:5005', 
    credentials: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'users_queue',
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices(); 
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
