// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport'; // Não precisa mais
// import { JwtStrategy } from './jwt.strategy'; // Não precisa mais
import { MyJwtAuthGuard } from './guards/my-jwt-auth.guard'; // Adicione seu novo guarda
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    // Se você não usa mais PassportModule, pode remover
    // PassportModule.register({}),
  ],
  providers: [
    // JwtStrategy, // Remova
    MyJwtAuthGuard, // Adicione aqui como um provedor
    RolesGuard, // Mantenha se for usar
  ],
  exports: [
    // PassportModule, JwtStrategy, // Remova se não usar
    MyJwtAuthGuard, // Exporte seu novo guarda
    RolesGuard, // Exporte se for usar
  ],
})
export class AuthModule {}