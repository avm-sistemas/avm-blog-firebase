import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as express from 'express'; 

async function bootstrap() {
  const appOptions = {
    //cors: true    
  };  
  const app = await NestFactory.create(AppModule, appOptions);

 // --- Adicione este middleware de log TEMPORARIAMENTE ---
    app.use((req, res, next) => {
        console.log('--- Requisição Recebida ---');
        console.log('URL:', req.url);
        console.log('Method:', req.method);
        console.log('Authorization Header:', req.headers.authorization);
        console.log('--- Fim do Log ---');
        next();
    });
    // ----------------------------------------------------
    app.use((req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Ou 'unsafe-none' para teste (não recomendado em prod)
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
  app.enableCors(); // Permite que o frontend Ionic se conecte
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); // Habilita validação global de DTOs

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();