import { NestFactory } from '@nestjs/core';
import { AutocompleteModule } from './autocomplete.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AutocompleteModule);
  app.enableCors({
    origin: 'http://localhost:5005',
    credentials: false,
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'autocomplete_queue',
      queueOptions: { durable: false },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
