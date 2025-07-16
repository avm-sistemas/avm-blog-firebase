import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import * as express from 'express'; 
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const appOptions: NestApplicationOptions = {    
    //cors: true
  };  
  const app = await NestFactory.create(AppModule, appOptions);

  app.use((req, res, next) => {
    // Ou 'unsafe-none' para teste (não recomendado em prod)
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); 
      next();
  });

  app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,        
  });

  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb', extended: true}));

  app.setGlobalPrefix('api');  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); // Habilita validação global de DTOs

  const swaggerCustomOptions = {
    explorer: false,
    customCss: '.swagger-ui .topbar { background-color: black; display: none; } .swagger-ui img { display: none; }',
    customSiteTitle: 'The Blogger Backend',
    customfavIcon: ""
  }

  const swaggerOptions = new DocumentBuilder()
    .setTitle('The Blogger Backend')
    .setDescription('avmsistemas.net')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('docs', app, document, swaggerCustomOptions);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();