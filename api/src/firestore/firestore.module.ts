// src/firestore/firestore.module.ts
import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin'; // Importe o Firebase Admin SDK

@Global() // Se este módulo deve ser acessível em qualquer lugar
@Module({
  providers: [
    {
      provide: 'FIRESTORE_DATABASE', // Um token de injeção mais específico para o DB
      useFactory: (firebaseApp: admin.app.App) => {
        // Certifique-se de que o provedor 'FIRESTORE' está injetando admin.app.App
        // Se 'FIRESTORE' já é o App, você pode injetá-lo aqui
        return firebaseApp.firestore(); // Retorne a instância do Firestore
      },
      inject: ['FIRESTORE'], // <<-- Injete o token do seu FirebaseModule aqui
    },
  ],
  exports: ['FIRESTORE_DATABASE'], // Exporte o token do Firestore
})
export class FirestoreModule {}
