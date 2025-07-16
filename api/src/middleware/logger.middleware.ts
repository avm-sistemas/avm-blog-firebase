import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {    
    console.log(`[${new Date().toISOString()}] req:`, {
      headers: req.headers,
      body: (req.method === 'POST' ? JSON.stringify(req.body) : req.body),
      originalUrl: req.originalUrl,
    });
    next();
  }
}