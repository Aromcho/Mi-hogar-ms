import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

const jwtService = new JwtService({ secret: process.env.JWT_SECRET || 'secret' });

export async function decodeUserMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) return next();

  try {
    const payload = await jwtService.verifyAsync(token);
    req['user'] = payload;
  } catch (err) {
    console.warn('Token inválido o expirado:', err.message);
    delete req['user'];
  }

  next();
}