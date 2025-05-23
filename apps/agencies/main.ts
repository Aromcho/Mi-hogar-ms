import { NestFactory } from '@nestjs/core';
import { AgenciesModule } from './src/agencies.module';
import * as morgan from 'morgan';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AgenciesModule);
  app.use(morgan('dev'));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'agencies_queue',
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();

  await app.startAllMicroservices();
  await app.listen(3006, '0.0.0.0');
}
bootstrap();
