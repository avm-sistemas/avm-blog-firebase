import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  // Exemplo: Endpoint para admins definirem roles de usuários
  @Post('assign-role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin') // Apenas usuários com a role 'admin' podem acessar
  async assignRole(@Body() body: { uid: string; role: string }) {
    await this.authService.assignRole(body.uid, body.role);
    return { message: `Role '${body.role}' assigned to user ${body.uid}` };
  }

  @Post('remove-role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async removeRole(@Body() body: { uid: string; role: string }) {
    await this.authService.removeRole(body.uid, body.role);
    return { message: `Role '${body.role}' removed from user ${body.uid}` };
  }
}