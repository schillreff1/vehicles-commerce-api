import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class EnsureIsSeller implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    if (!req.user.isSeller) {
      throw new UnauthorizedException('Not an seller');
    }

    return next();
  }
}
