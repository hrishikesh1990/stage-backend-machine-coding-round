import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    req.headers['x-user'] = '';

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    // Extract and decode the Basic auth credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Mock verification: username should equal password
    if (!username || !password || username !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Add the authenticated user to the request headers
    req.headers['x-user'] = username;

    next();
  }
} 