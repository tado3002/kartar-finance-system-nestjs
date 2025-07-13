import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

// Simpan instance Express (tidak null)
let cachedApp: any = null;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  // app tidak akan null di sini
  return app(req, res);
}
