import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Booking Service API')
    .setDescription('API documentation for the Booking Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT) || 3003;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();