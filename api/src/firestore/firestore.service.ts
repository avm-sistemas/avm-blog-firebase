import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

@Injectable()
export class FirestoreService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIRESTORE') firestore: admin.firestore.Firestore) {
    this.firestore = firestore;
  }

  async upload(database: string, json: string): Promise<string> {
    try {      
      const data = fs.readFileSync(json, 'utf8');
      const services = JSON.parse(data);

      if (!Array.isArray(services)) {
        throw new Error(`O arquivo ${json} não contém um array de ${database}.`);
      }

      const batch = this.firestore.batch();
      const collectionRef = this.firestore.collection(database);

      for (const service of services) {
        let docRef: admin.firestore.DocumentReference;

        // Verifica se service.id existe e é uma string não vazia
        if (service.id && typeof service.id === 'string' && service.id.trim() !== '') {
          docRef = collectionRef.doc(service.id);
        } else {
          // Se service.id for inválido ou ausente, o Firestore gera um ID automático
          docRef = collectionRef.doc();
          // Opcional: Se você quiser que o objeto no Firestore contenha o ID gerado, adicione-o
          // service.id = docRef.id;
        }
        batch.set(docRef, service);
      }
      await batch.commit();
      return `Todos os ${services.length} da coleção ${database} foram enviados com sucesso para o Firestore.`;
    } catch (error) {
      console.error('Erro ao enviar dados para o Firestore:', error);
      throw new Error(`Falha ao enviar dados para o Firestore: ${error.message}`);
    }
  }
  
}