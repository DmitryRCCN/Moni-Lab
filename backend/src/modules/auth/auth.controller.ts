import { Request, Response } from 'express';
import { registerSchema, loginSchema } from './auth.schema';
import { registerUser, loginUser, refreshAccessToken, revokeRefreshToken } from './auth.service';
import { z } from 'zod';

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data);
    res.status(201).json(result);
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
    const result = await loginUser(data.email, data.password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

/**
 * POST /auth/refresh
 * Genera un nuevo access token usando el refresh token
 */
export async function refresh(req: Request, res: Response) {
  try {
    const data = refreshSchema.parse(req.body);
    const result = await refreshAccessToken(data.refreshToken);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

/**
 * POST /auth/logout
 * Revoca el refresh token (cierra sesión)
 */
export async function logout(req: Request, res: Response) {
  try {
    const data = refreshSchema.parse(req.body);
    await revokeRefreshToken(data.refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
