import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // Esto bloquea información adicional que no necesita el backend
      // Util en una RESTful Api. GraphQL se encarga de hacer lo mismo sin necesidad de la linea de abajo
      // forbidNonWhitelisted: true
    })
  )

  await app.listen(3000);
}
bootstrap();
