import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  setupSwagger(app);
  await app.listen(8080);
}
bootstrap();
