import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

dotenv.config();

interface Idecoded {
  isSeller: boolean;
  sub: string;
}

@Injectable()
export class EnsureAuthMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded: Idecoded) => {
      if (err || !decoded) {
        throw new UnauthorizedException('Invalid token');
      }
      req.user = { id: decoded.sub, isSeller: decoded.isSeller };

      return next();
    });
  }
}
