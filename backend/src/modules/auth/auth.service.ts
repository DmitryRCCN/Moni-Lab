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

// Definimos los ítems básicos que todo usuario recibe al iniciar
// Deben coincidir con lo que haya en la tabla 'item'
const INITIAL_ITEMS = [
  // Ítems EQUIPADOS por defecto (X)
  { id: 'sky_blue', equipped: true },
  { id: 'base_peach', equipped: true },
  { id: 'shirt_red', equipped: true },
  { id: 'default_eyes', equipped: true },
  { id: 'short_brown', equipped: true },
  { id: 'none', equipped: true }, // Accesorio vacío

  // Ítems DESBLOQUEADOS pero NO equipados (Y)
  { id: 'neon_jacket', equipped: false },
  { id: 'cyber_visor', equipped: false },
  { id: 'spartan_helmet', equipped: false },
  { id: 'dark_bg', equipped: false }
];

export async function registerUser(data: {
  email: string;
  password: string;
  nombre: string;
}): Promise<AuthResponse> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userId = uuid();

  // 1. Crear el usuario base
  await db.execute({
    sql: `INSERT INTO usuarios (id, email, password, nombre) VALUES (?, ?, ?, ?)`,
    args: [userId, data.email, hashedPassword, data.nombre],
  });

  // 2. Asignar ítems al inventario (adquirirlos) y EQUIPARLOS directamente
  // Usamos la tabla 'usuario_item' con equipado = true
  for (const itemId of INITIAL_ITEMS) {
    await db.execute({
      sql: `
        INSERT INTO usuario_item (id_usuario, id_item, equipado) 
        VALUES (?, ?, ?)
      `,
      args: [userId, itemId.id, itemId.equipped],
    });
  }

  // 3. Generar tokens de sesión
  const accessToken = signAccessToken(userId);
  const refreshTokenId = uuid();
  const refreshToken = signRefreshToken(userId, refreshTokenId);
  const refreshTokenHash = hashToken(refreshToken);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await db.execute({
    sql: `INSERT INTO refresh_tokens (id, usuario_id, token_hash, expires_at) VALUES (?, ?, ?, ?)`,
    args: [refreshTokenId, userId, refreshTokenHash, expiresAt],
  });

  // 4. INICIALIZAR PROGRESO (Desbloqueo inicial)
  try {
    // Obtener el primer nodo (el que tenga el orden_secuencial más bajo)
    const primerNodoRes = await db.execute(
        "SELECT id_nodo FROM nodo ORDER BY orden_secuencial ASC LIMIT 1"
    );
    const primerNodoId = primerNodoRes.rows[0]?.id_nodo;

    if (primerNodoId) {
      // Crear registro de progreso para el primer nodo como 'disponible'
      await db.execute({
        sql: `INSERT INTO progreso_nodo (id_progreso, id_usuario, id_nodo, estado, mejor_puntaje) 
              VALUES (?, ?, ?, ?, ?)`, 
        args: [uuid(), userId, primerNodoId, 'disponible', 0],
      });

      // Obtener la primera actividad de ese nodo
      const primeraActividadRes = await db.execute({
        sql: "SELECT id_actividad FROM actividad WHERE id_nodo = ? ORDER BY orden_secuencial ASC LIMIT 1",
        args: [primerNodoId]
      });
      
      const primeraActividadId = primeraActividadRes.rows[0]?.id_actividad;

      if (primeraActividadId) {
        // Crear registro de progreso para la primera actividad como 'disponible'
        await db.execute({
          sql: `INSERT INTO progreso_actividad (id_progreso, id_usuario, id_actividad, estado, mejor_puntaje) 
                VALUES (?, ?, ?, 'disponible', 0)`,
          args: [uuid(), userId, primeraActividadId],
        });
      }
    }
  } catch (error) {
    console.warn("Error al inicializar el progreso del usuario:", error);
    // No bloqueamos el registro si falla el progreso, pero es ideal que funcione
  }

  // 5. Obtener el perfil completo del usuario recién creado
  const userFullProfile = await getUserProfile(userId);

  return {
    accessToken,
    refreshToken,
    user: userFullProfile,
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

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await db.execute({
    sql: `INSERT INTO refresh_tokens (id, usuario_id, token_hash, expires_at) VALUES (?, ?, ?, ?)`,
    args: [refreshTokenId, user.id, refreshTokenHash, expiresAt],
  });

  const userFullProfile = await getUserProfile(user.id);

  return {
    accessToken,
    refreshToken,
    user: userFullProfile,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
}> {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const refreshTokenHash = hashToken(refreshToken);

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

    const accessToken = signAccessToken(decoded.userId);
    return { accessToken };
  } catch (error: any) {
    throw new Error(error.message || 'Token refresh failed');
  }
}

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