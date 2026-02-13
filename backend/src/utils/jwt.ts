import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import crypto from 'crypto';

export interface AccessTokenPayload {
  userId: string;
  type: 'access';
}

export interface RefreshTokenPayload {
  userId: string;
  type: 'refresh';
  tokenId: string;
}

/**
 * Genera un token de acceso (corta duración)
 * Default: 15 minutos
 */
export function signAccessToken(userId: string) {
  return jwt.sign(
    { userId, type: 'access' } as AccessTokenPayload,
    env.JWT_SECRET,
    { expiresIn: '15m' } // 15 minutos
  );
}

/**
 * Genera un token de refresco (larga duración)
 * Default: 7 días
 */
export function signRefreshToken(userId: string, tokenId: string) {
  return jwt.sign(
    { userId, type: 'refresh', tokenId } as RefreshTokenPayload,
    env.JWT_SECRET,
    { expiresIn: '7d' } // 7 días
  );
}

/**
 * Verifica un token de acceso
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
  if (decoded.type !== 'access') {
    throw new Error('Invalid token type');
  }
  return decoded;
}

/**
 * Verifica un token de refresco
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as RefreshTokenPayload;
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }
  return decoded;
}

/**
 * Genera un hash SHA256 del refresh token para almacenarlo en la BD
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
