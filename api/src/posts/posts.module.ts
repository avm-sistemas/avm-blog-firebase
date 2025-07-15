// src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { FirestoreModule } from 'src/firestore/firestore.module';

@Module({
  imports: [
    FirebaseModule,
    FirestoreModule    
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
