import { NestFactory } from '@nestjs/core';
import { AutocompleteModule } from './autocomplete.module';

async function bootstrap() {
  const app = await NestFactory.create(AutocompleteModule);
  app.enableCors({
    origin: 'http://localhost:5005',
    credentials: false,
  });
  await app.listen(3001);
}
bootstrap();
