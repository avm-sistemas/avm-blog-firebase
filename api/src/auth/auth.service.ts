import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(@Inject('FIRESTORE') private readonly firebaseAdmin: admin.app.App) {
  }

  async validateUser(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }

  // Opcional: Função para definir custom claims (roles) para um usuário
  async setCustomUserRole(uid: string, role: string | string[]): Promise<void> {
    const customClaims = typeof role === 'string' ? { role: role } : { roles: role };
    await this.firebaseAdmin.auth().setCustomUserClaims(uid, customClaims);
    // Para forçar o refresh do token no cliente:
    // const user = await this.firebaseAdmin.auth().getUser(uid);
    // await this.firebaseAdmin.auth().revokeRefreshTokens(uid);
    console.log(`Custom claims for user ${uid} set to:`, customClaims);
  }

  // Exemplo de como um endpoint de administrador poderia ser usado para definir roles
  async assignRole(uid: string, role: string): Promise<void> {
    const userRecord = await this.firebaseAdmin.auth().getUser(uid);
    const currentClaims = userRecord.customClaims || {};
    let rolesArray = Array.isArray(currentClaims.roles) ? currentClaims.roles : [];

    if (!rolesArray.includes(role)) {
      rolesArray.push(role);
    }

    await this.setCustomUserRole(uid, rolesArray);
  }

  async removeRole(uid: string, role: string): Promise<void> {
    const userRecord = await this.firebaseAdmin.auth().getUser(uid);
    const currentClaims = userRecord.customClaims || {};
    let rolesArray = Array.isArray(currentClaims.roles) ? currentClaims.roles : [];

    rolesArray = rolesArray.filter(r => r !== role);

    await this.setCustomUserRole(uid, rolesArray);
  }
}