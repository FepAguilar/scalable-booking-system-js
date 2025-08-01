import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('API for managing users')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // ⬅️ Swagger at /api

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Server ready at http://localhost:${port}/api`);
}
bootstrap();
