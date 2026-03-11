import bcrypt from 'bcrypt';
import { db } from '../../db/client';
import { signAccessToken, signRefreshToken, hashToken, verifyRefreshToken } from '../../utils/jwt';
import { v4 as uuid } from 'uuid';
import { getUserProfile } from '../usuario/usuario.service';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
}

export async function registerUser(data: {
  email: string;
  password: string;
  nombre: string;
}): Promise<AuthResponse> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userId = uuid();

  await db.execute({
    sql: `
      INSERT INTO usuarios (id, email, password, nombre)
      VALUES (?, ?, ?, ?)
    `,
    args: [userId, data.email, hashedPassword, data.nombre],
  });

  // Generar tokens
  const accessToken = signAccessToken(userId);
  const refreshTokenId = uuid();
  const refreshToken = signRefreshToken(userId, refreshTokenId);
  const refreshTokenHash = hashToken(refreshToken);

  // Guardar refresh token en BD (expira en 7 días)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await db.execute({
    sql: `
      INSERT INTO refresh_tokens (id, usuario_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `,
    args: [refreshTokenId, userId, refreshTokenHash, expiresAt],
  });

  // --- Obtenemos el perfil completo recién creado ---
  const userFullProfile = await getUserProfile(userId);

  return {
    accessToken,
    refreshToken,
    user: userFullProfile, // Devolvemos el perfil completo con estadísticas e items comprados (aunque estará vacío al ser nuevo)
  };
}

export async function loginUser(nombre: string, password: string): Promise<AuthResponse> {
  const result = await db.execute({
    sql: `SELECT id, email, password, nombre FROM usuarios WHERE nombre = ? AND activo = true`,
    args: [nombre],
  });

  const user = result.rows[0] as any;

  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) throw new Error('Invalid credentials');

  // Generar tokens
  const accessToken = signAccessToken(user.id);
  const refreshTokenId = uuid();
  const refreshToken = signRefreshToken(user.id, refreshTokenId);
  const refreshTokenHash = hashToken(refreshToken);

  // Guardar refresh token en BD (expira en 7 días)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await db.execute({
    sql: `
      INSERT INTO refresh_tokens (id, usuario_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `,
    args: [refreshTokenId, user.id, refreshTokenHash, expiresAt],
  });

  // --- Obtenemos el perfil completo con ítems y monedas ---
  const userFullProfile = await getUserProfile(user.id);

  return {
    accessToken,
    refreshToken,
    user: userFullProfile,
  };
}

/**
 * Refresca el access token usando un refresh token válido
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
}> {
  try {
    // Verificar que el refresh token sea válido
    const decoded = verifyRefreshToken(refreshToken);
    const refreshTokenHash = hashToken(refreshToken);

    // Validar que existe en BD y no está revocado
    const result = await db.execute({
      sql: `
        SELECT * FROM refresh_tokens 
        WHERE token_hash = ? 
        AND usuario_id = ? 
        AND revoked = false 
        AND expires_at > datetime('now')
      `,
      args: [refreshTokenHash, decoded.userId],
    });

    if (result.rows.length === 0) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generar nuevo access token
    const accessToken = signAccessToken(decoded.userId);

    return { accessToken };
  } catch (error: any) {
    throw new Error(error.message || 'Token refresh failed');
  }
}

/**
 * Revoca un refresh token (logout)
 */
export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const refreshTokenHash = hashToken(refreshToken);

    await db.execute({
      sql: `
        UPDATE refresh_tokens 
        SET revoked = true 
        WHERE token_hash = ? 
        AND usuario_id = ?
      `,
      args: [refreshTokenHash, decoded.userId],
    });
  } catch (error) {
    // Silenciar error si el token ya no es válido
  }
}
