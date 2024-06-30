import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config: any = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Ostivities')
    .setDescription('This is the official Ostivities API documentation')
    .setVersion('1.0.0')
    // .addServer('https://ostivities.herokuapp.com/v1/api')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('docs', app, document);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('v1/api');

  app.enableCors();

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
