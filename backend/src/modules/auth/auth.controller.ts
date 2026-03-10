import { Request, Response } from 'express';
import { registerSchema, loginSchema } from './auth.schema';
import { registerUser, loginUser, refreshAccessToken, revokeRefreshToken } from './auth.service';
import { z } from 'zod';
import { env } from '../../config/env';
import { mailService } from '../mail/mail.service';

const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

// Configuración de cookies compartida para consistencia
const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: true, // Requerido para sameSite: 'none'
  sameSite: 'none' as const,
  domain: env.NODE_ENV === 'production' ? '.monilab.com.mx' : undefined,
  maxAge,
});

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data);

    //  Disparar correo de bienvenida (Sin await para no retrasar la respuesta al cliente)
    mailService.sendWelcomeEmail(data.email, data.nombre).catch(err => {
      console.error('Error enviando correo de bienvenida:', err);
    });
    
    res.cookie('refreshToken', result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.status(201).json({ accessToken: result.accessToken, user: result.user });
  } catch (err: any) {
    if (err.code === 'UNIQUE constraint failed: usuarios.email') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data.nombre, data.password);
    
    res.cookie('refreshToken', result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.json({ accessToken: result.accessToken, user: result.user });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const data = refreshSchema.parse(body);
    const token = data.refreshToken || req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ error: 'No hay sesión activa' });
    }

    const result = await refreshAccessToken(token);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: 'Sesión inválida' });
  }
}

/**
 * POST /auth/logout
 * Revoca el refresh token y limpia la cookie
 */
export async function logout(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const data = refreshSchema.parse(body);
    const token = data.refreshToken || req.cookies?.refreshToken;

    // Si hay un token, intentamos revocarlo en la base de datos
    if (token) {
      await revokeRefreshToken(token).catch(() => {
        // Ignoramos errores si el token ya expiró o no existe en la BD
      });
    }

    // Limpiamos la cookie usando las mismas opciones que al crearla (maxAge: 0)
    res.clearCookie('refreshToken', getCookieOptions(0));
    
    // Devolvemos 200 porque, haya habido token o no, la sesión ahora está cerrada
    res.json({ message: 'Sesión cerrada correctamente' });
  } catch (err: any) {
    // Solo enviamos error si algo realmente falló en el servidor
    res.status(500).json({ error: 'Error al procesar el cierre de sesión' });
  }
}