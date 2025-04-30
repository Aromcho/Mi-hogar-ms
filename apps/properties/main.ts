import { NestFactory } from '@nestjs/core';
import { PropertiesModule } from './src/properties.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

async function bootstrap() {
  try {
    const app = await NestFactory.create(PropertiesModule);
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.enableCors({
      origin: '*',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'properties_queue',
        queueOptions: { durable: false },
      },
    });
    await app.startAllMicroservices(); // Levanta RabbitMQ listener
    await app.listen(3003, '0.0.0.0');
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}
bootstrap();
