import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {UseFilters, ValidationPipe} from '@nestjs/common';
import {HttpExceptionFilter} from './filters/http.filter';
import {FallbackExceptionFilter} from './filters/fallback.filter';
import * as mongoose from 'mongoose';
import {ValidationException} from './filters/validation.exception';
import {ValidationFilter} from './filters/validation.filter';
import {ValidationError} from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(
    new FallbackExceptionFilter(),
    new HttpExceptionFilter(),
    new ValidationFilter(),
    );

  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties: true,
    exceptionFactory: (errors: ValidationError[]) => {

      const messages = errors.map(
        error => `${error.property} has wrong value ${error.value}.${Object.values(error.constraints).join(', ')}`
      );

      return new ValidationException(messages);
    }
  }));

  app.listen(9000);
}

bootstrap();
