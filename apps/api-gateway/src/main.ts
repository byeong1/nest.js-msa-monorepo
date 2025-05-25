import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for API Gateway
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러
      transform: true, // 요청 데이터를 DTO 타입으로 자동 변환
      transformOptions: {
        enableImplicitConversion: true, // 암시적 타입 변환 허용
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log('API Gateway is running on port 3000');
}
bootstrap();
