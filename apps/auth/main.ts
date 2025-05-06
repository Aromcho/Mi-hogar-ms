import { NestFactory } from '@nestjs/core';
import { AuthModule } from './src/auth.module';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {logger: ['log', 'debug', 'error', 'warn'],});
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL, // ✅ el dominio de tu frontend
    credentials: true,
  });  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'auth_queue',
      queueOptions: { durable: false },
    },
  });
  await app.startAllMicroservices();
  
  await app.listen(3002, '0.0.0.0');
}
bootstrap();
