import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface ConfirmationPayload {
  email: string;
  nombre: string;
  password: string; // hashedPassword
  type: 'REGISTRATION_CONFIRM';
  iat?: number;
  exp?: number;
}

interface PendingConfirmation {
  email: string;
  nombre: string;
  password: string;
}

/**
 * Crea un JWT firmado con datos de confirmación
 * El token contiene los datos embebidos (sin almacenamiento externo)
 * Retorna el token a enviar por email
 */
export function createConfirmationRequest(
  email: string,
  nombre: string,
  hashedPassword: string,
  ttlSeconds: number = 15 * 60 // 15 minutos por defecto
): string {
  const payload: ConfirmationPayload = {
    email,
    nombre,
    password: hashedPassword,
    type: 'REGISTRATION_CONFIRM',
  };

  // Firmar con JWT (se expira automáticamente con expiresIn)
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: ttlSeconds,
  });

  return token;
}

/**
 * Verifica y decodifica un token de confirmación
 * Retorna los datos embebidos si es válido
 */
export function verifyConfirmationToken(token: string): PendingConfirmation | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as ConfirmationPayload;

    // Verificación extra del tipo
    if (decoded.type !== 'REGISTRATION_CONFIRM') {
      return null;
    }

    return {
      email: decoded.email,
      nombre: decoded.nombre,
      password: decoded.password,
    };
  } catch (error: any) {
    // JWT inválido o expirado
    if (error.name === 'TokenExpiredError') {
      throw new Error('TOKEN_EXPIRED');
    }
    return null;
  }
}

/**
 * Confirma un registro extrayendo datos del JWT
 * (No es destructivo como el Map, el mismo token puede verificarse múltiples veces)
 */
export function confirmRegistration(token: string): PendingConfirmation | null {
  return verifyConfirmationToken(token);
}
