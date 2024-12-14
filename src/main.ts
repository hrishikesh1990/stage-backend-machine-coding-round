import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    credentials: true,
  });

  // Swagger setup for API documentation
  const config = new DocumentBuilder()
    .setTitle('Stage Api docs')
    .setDescription('Have all the routes documentation for user, movies and tvshows')
    .setVersion('1.0')
    .addServer('http://127.0.0.1:3000', 'Default Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Global pipes setup for validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Start the application
  await app.listen(process.env.PORT || 3000);
}
bootstrap();