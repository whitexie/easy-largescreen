import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './interceptors/exception.interceptor';
import { TransformInterceptor } from './interceptors/responseTransform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: false,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
      exposeUnsetFields: false,
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('easy-largescreen')
    .setDescription('largescreen')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
