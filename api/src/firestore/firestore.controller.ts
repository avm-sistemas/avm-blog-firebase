import { Controller, Post, Res, HttpStatus, Body, Param } from '@nestjs/common';
import { Response } from 'express';
import { FirestoreService } from '../firestore/firestore.service';

@Controller('firestore')
export class FirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Post('upload/:database')
  async upload(@Res() res: Response, @Param('database') database: string, @Body() json: string) {
    try {
      const message = await this.firestoreService.upload(database, json);
      return res.status(HttpStatus.OK).json({ message });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}
