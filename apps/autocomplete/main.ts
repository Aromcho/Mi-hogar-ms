import { NestFactory } from '@nestjs/core';
import { AutocompleteModule } from './src/autocomplete.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AutocompleteModule);
  app.enableCors({
    origin: '*',
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
