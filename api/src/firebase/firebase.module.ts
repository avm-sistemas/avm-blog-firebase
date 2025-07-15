import { Module, Global, InternalServerErrorException } from '@nestjs/common'; // Importe InternalServerErrorException
import * as admin from 'firebase-admin';
import * as path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIRESTORE',
      useFactory: (configService: ConfigService) => {
        const firebaseServiceAccountPath = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');

        // 1. Verificação para garantir que a variável de ambiente está definida
        if (!firebaseServiceAccountPath) {
          throw new InternalServerErrorException(
            'FIREBASE_SERVICE_ACCOUNT_PATH não está definida nas variáveis de ambiente. Verifique seu arquivo .env.',
          );
        }

        const serviceAccountPath = path.resolve(process.cwd(), firebaseServiceAccountPath);
        
        // 2. Verificação para garantir que o arquivo de credenciais existe
        if (!fs.existsSync(serviceAccountPath)) {
          throw new InternalServerErrorException(
            `O arquivo de credenciais do Firebase não foi encontrado em: ${serviceAccountPath}. Verifique o caminho em FIREBASE_SERVICE_ACCOUNT_PATH no seu .env.`,
          );
        }

        const serviceAccount = require(serviceAccountPath);

        let firebaseApp: admin.app.App;
        if (admin.apps.length === 0) {
            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log('Firebase Admin SDK inicializado com sucesso.');
        } else {
            firebaseApp = admin.app();
        }

        // RETORNA A INSTÂNCIA DO APP COMPLETA, NÃO APENAS O FIRESTORE
        return firebaseApp;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['FIRESTORE'],
})
export class FirebaseModule {}