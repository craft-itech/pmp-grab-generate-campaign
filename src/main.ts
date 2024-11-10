import { NestFactory } from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import { AppModule } from './module/app.module';

async function bootstrap() {
  // web module
  const app = await NestFactory.create(AppModule);

  // swagger
  const config = new DocumentBuilder().setTitle('TopsVita Adapter Swagger').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
  console.log('webapp is listening')
}

bootstrap()
