import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle(process.env.APP_NAME || 'NestJS SaaS API')
  .setDescription('API documentation for NestJS SaaS Template')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
