import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { verifyAccessToken } from '../../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn('⚠️ [AUTH] Missing authorization header');
    return res.status(401).json({ 
      error: 'Token missing',
      hint: 'Include Authorization header: Bearer <accessToken>'
    });
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.warn('⚠️ [AUTH] Invalid authorization format:', authHeader.substring(0, 20) + '...');
    return res.status(401).json({ 
      error: 'Invalid authorization format',
      hint: 'Use: Authorization: Bearer <accessToken>'
    });
  }

  const token = parts[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = { userId: decoded.userId };
    console.log(`✅ [AUTH] User ${decoded.userId} authenticated`);
    next();
  } catch (error: any) {
    console.warn('⚠️ [AUTH] Token verification failed:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        hint: 'Use POST /auth/refresh to get a new access token'
      });
    }
    
    return res.status(401).json({ error: 'Invalid or malformed token' });
  }
}
