import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Workspace Service API')
    .setDescription('API documentation for the Workspace Service')
    .setVersion('1.0')
    .addBearerAuth() // optional: if using JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Port setup
  const port = Number(process.env.PORT) || 3002;
  await app.listen(port);

  console.log(`🚀 Server ready at http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
