import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/error.filter';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  const config = new DocumentBuilder()
    .setTitle('SerPSI API')
    .setDescription(
      'API docs for SerPSI backend, contains all routes opened to the public'
    )
    .setVersion('1.0')
    .addTag('auth')
    .addTag('agendas')
    .addTag('bills')
    .addTag('documents')
    .addTag('meetings')
    .addTag('notifications')
    .addTag('patients')
    .addTag('persons')
    .addTag('psychologists')
    .addTag('users')
    .addTag('default')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
