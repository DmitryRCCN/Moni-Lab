import { Request, Response } from 'express';
import { registerSchema, loginSchema } from './auth.schema';
import { registerUser, loginUser, refreshAccessToken, revokeRefreshToken } from './auth.service';
import { z } from 'zod';
import { env } from '../../config/env';

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data);
    // Set refresh token as HttpOnly cookie and don't expose it in JSON
    const cookieOptions = {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie('refreshToken', result.refreshToken, cookieOptions);
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
    const result = await loginUser(data.email, data.password);
    const cookieOptions = {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('refreshToken', result.refreshToken, cookieOptions);
    res.json({ accessToken: result.accessToken, user: result.user });
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
    const token = data.refreshToken || (req as any).cookies?.refreshToken;
    if (!token) return res.status(400).json({ error: 'Refresh token required' });
    const result = await refreshAccessToken(token);
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
    const token = data.refreshToken || (req as any).cookies?.refreshToken;
    if (!token) return res.status(400).json({ error: 'Refresh token required' });
    await revokeRefreshToken(token);
    const cookieOptions = {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
    };
    res.clearCookie('refreshToken', cookieOptions);
    res.json({ message: 'Logged out successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
