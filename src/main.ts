import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
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
