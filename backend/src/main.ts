import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { GqlValidationExceptionFilter } from './common/filters/gql-validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(new GqlValidationExceptionFilter());
  app.use(cookieParser());

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = configService.get<number>('app.port')!;
  await app.listen(port);
}
bootstrap();
