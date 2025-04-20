import { NestFactory } from '@nestjs/core';
import { DevelopmentsModule } from './src/developments.module';

async function bootstrap() {
  const app = await NestFactory.create(DevelopmentsModule);
  await app.listen(3005, '0.0.0.0');
}
bootstrap();
