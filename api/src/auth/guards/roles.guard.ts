// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // Sem injeção de FIRESTORE aqui

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se nenhum role é exigido ou a lista está vazia, permite acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('RolesGuard: Nenhuma role exigida. Acesso permitido.');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Este é o decodedToken que contém os claims

    // **COLOQUE O BREAKPOINT AQUI** e inspecione `user`
    console.log('RolesGuard: Usuário (req.user) recebido:', user);
    console.log('RolesGuard: Roles exigidas:', requiredRoles);

    if (!user || !user.uid) {
      console.warn('RolesGuard: Usuário não autenticado ou sem UID no token.');
      return false; // Deve ser raro, pois o JwtStrategy já teria barrado
    }

    // --- Lógica para extrair as roles do token ---
    let userRoles: string[] = [];

    // Priorize 'roles' se for um array
    if (Array.isArray(user.roles)) {
      userRoles = user.roles.map((role: any) => String(role).toLowerCase()); // Garante que é string e minúsculo
    }
    // Se 'role' existe e 'roles' não foi um array válido, ou para adicionar 'role' se 'roles' já existe
    else if (user.role && typeof user.role === 'string') {
      userRoles.push(String(user.role).toLowerCase()); // Adiciona a role como minúscula
    }

    // Para o caso específico de ter um claim booleano 'admin: true'
    if (user.admin === true && !userRoles.includes('admin')) {
        userRoles.push('admin');
    }

    // Remove duplicatas e garante que todos são minúsculos para comparação consistente
    userRoles = [...new Set(userRoles)].map(role => role.toLowerCase());

    console.log('RolesGuard: Roles do usuário (extraídas do token):', userRoles);

    // Verifica se o usuário possui pelo menos uma das roles requeridas
    const hasRequiredRole = requiredRoles.some(requiredRole => userRoles.includes(requiredRole.toLowerCase())); // Compara em minúsculas

    if (!hasRequiredRole) {
      console.warn(`RolesGuard: Usuário ${user.uid} NÃO tem as roles necessárias. Exigidas: ${requiredRoles.join(', ')}, Usuário tem: ${userRoles.join(', ')}`);
    }

    return hasRequiredRole;
  }
}