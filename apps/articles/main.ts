import { NestFactory } from '@nestjs/core';
import { ArticlesModule } from './src/articles.module';

async function bootstrap() {
  const app = await NestFactory.create(ArticlesModule,{logger: ['log', 'debug', 'error', 'warn'],});
  await app.listen(3004, '0.0.0.0');
}
bootstrap();
