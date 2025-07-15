import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MyJwtAuthGuard } from 'src/auth/guards/my-jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseGuards(MyJwtAuthGuard) // Protege o endpoint com autenticação e roles
  @Roles('admin', 'editor') // Somente usuários com a role 'admin' ou 'editor' podem criar
    async create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    // ADICIONE ESTE LOG
    console.log('Requisição chegou ao PostsController!');
    console.log('req.user no Controller:', req.user); // Inspecione o objeto user        
    // req.user contém o token decodificado do Firebase (incluindo uid e custom claims)
    return this.postsService.create({ ...createPostDto, authorUid: req.user.uid, authorEmail: req.user.email });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor') // Somente admins ou editores podem editar
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content para deleção bem-sucedida
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin') // Somente admins podem deletar
  async remove(@Param('id') id: string) {
    await this.postsService.remove(id);
  }
}