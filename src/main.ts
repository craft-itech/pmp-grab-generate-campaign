import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';

async function bootstrap() {
  // web module
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
  console.log('webapp is listening')
}

bootstrap()
