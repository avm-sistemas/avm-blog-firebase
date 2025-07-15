// src/auth/guards/my-jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import * as admin from 'firebase-admin'; // Importe o Firebase Admin SDK

@Injectable()
export class MyJwtAuthGuard implements CanActivate {
  constructor(@Inject('FIRESTORE') private readonly firebaseAdminApp: admin.app.App) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação não fornecido ou formato inválido.');
    }

    const idToken = authHeader.split(' ')[1];

    try {
      // Valida o token usando o Firebase Admin SDK
      const decodedToken = await this.firebaseAdminApp.auth().verifyIdToken(idToken);
      
      // Anexa o token decodificado ao objeto de requisição para uso posterior (e.g., por RolesGuard)
      request.user = decodedToken;
      
      console.log('MyJwtAuthGuard: Token Firebase verificado e usuário anexado:', decodedToken.uid);
      return true; // Autenticação bem-sucedida
    } catch (error) {
      console.error('MyJwtAuthGuard: Erro na validação do token Firebase (direta):', error.message);
      // Erros comuns aqui: 'auth/id-token-expired', 'auth/argument-error'
      throw new UnauthorizedException('Token de autenticação inválido ou expirado.');
    }
  }
}
