import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { ExceptionsLoggerFilter } from './core/exception/http-error.exception';
import { CustomerBadRequestExceptionFilter } from './core/exception/badRequest.exception';

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Fullstack test API')
    .setDescription('The Fullstack test Backend API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  );
  app.useGlobalFilters(
    new ExceptionsLoggerFilter(),
    new CustomerBadRequestExceptionFilter(),
  );
  app.use(express.static('public'));
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log('> HTTP listen on port: ', port);
  });
};

bootstrap();
