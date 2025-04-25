import { NestFactory } from '@nestjs/core';
import { UsersModule } from './src/users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule, {
    logger: ['log', 'debug', 'error', 'warn'],
  });

  app.enableCors({
    origin: 'http://localhost:5005', // 👈 tu frontend Next.js
    credentials: true, // 👈 permite cookies
  });
  // 🔹 Configuración del microservicio con RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'users_queue',
      queueOptions: { durable: false },
    },
  });

  
  

  await app.startAllMicroservices(); // Levanta RabbitMQ listener
  await app.listen(3000, '0.0.0.0'); // Levanta API REST

  console.log('✅ Microservicio de usuarios levantado en puerto 3000');
}
bootstrap();
