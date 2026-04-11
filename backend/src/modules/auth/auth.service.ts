import bcrypt from 'bcrypt';
import { db } from '../../db/client';
import { signAccessToken, signRefreshToken, hashToken, verifyRefreshToken } from '../../utils/jwt';
import { v4 as uuid } from 'uuid';
import { getUserProfile } from '../usuario/usuario.service';
import { createConfirmationRequest, confirmRegistration } from '../../services/confirmation.service';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
}

const INITIAL_ITEMS = [
  { id: 'sky_blue', equipped: true },
  { id: 'base_peach', equipped: true },
  { id: 'shirt_red', equipped: true },
  { id: 'default_eyes', equipped: true },
  { id: 'short_brown', equipped: true },
  { id: 'none', equipped: true },
  { id: 'neon_jacket', equipped: false },
  { id: 'cyber_visor', equipped: false },
  { id: 'spartan_helmet', equipped: false },
  { id: 'dark_bg', equipped: false }
];

/**
 * Función auxiliar privada para crear un usuario con tokens de sesión
 * Contiene toda la lógica compartida de creación (ítems, tokens, progreso)
 */
async function createUserWithSessionTokens(
  email: string,
  nombre: string,
  hashedPassword: string
): Promise<AuthResponse> {
  const userId = uuid();

  try {
    // Verificar PRIMERO si el nombre ya existe (ANTES de crear el usuario)
    const existingNombre = await db.execute({
      sql: `SELECT id FROM usuarios WHERE nombre = ?`,
      args: [nombre],
    });

    if (existingNombre.rows.length > 0) {
      throw new Error('USERNAME_TAKEN');
    }

    // 1. Crear el usuario base
    await db.execute({
      sql: `INSERT INTO usuarios (id, email, password, nombre) VALUES (?, ?, ?, ?)`,
      args: [userId, email, hashedPassword, nombre],
    });

    // 2. Asignar ítems al inventario
    for (const itemId of INITIAL_ITEMS) {
      await db.execute({
        sql: `INSERT INTO usuario_item (id_usuario, id_item, equipado) VALUES (?, ?, ?)`,
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

    // 4. Inicializar progreso
    try {
      const primerNodoRes = await db.execute(
        "SELECT id_nodo FROM nodo ORDER BY orden_secuencial ASC LIMIT 1"
      );
      const primerNodoId = primerNodoRes.rows[0]?.id_nodo;

      if (primerNodoId) {
        // Verificar que no exista ya (evitar UNIQUE constraint)
        const existingProgress = await db.execute({
          sql: `SELECT id_progreso FROM progreso_nodo WHERE id_usuario = ? AND id_nodo = ?`,
          args: [userId, primerNodoId],
        });

        if (existingProgress.rows.length === 0) {
          await db.execute({
            sql: `INSERT INTO progreso_nodo (id_progreso, id_usuario, id_nodo, estado, mejor_puntaje) 
                  VALUES (?, ?, ?, ?, ?)`,
            args: [uuid(), userId, primerNodoId, 'disponible', 0],
          });
        }

        const primeraActividadRes = await db.execute({
          sql: "SELECT id_actividad FROM actividad WHERE id_nodo = ? ORDER BY orden_secuencial ASC LIMIT 1",
          args: [primerNodoId]
        });

        const primeraActividadId = primeraActividadRes.rows[0]?.id_actividad;

        if (primeraActividadId) {
          // Verificar que no exista ya
          const existingActivity = await db.execute({
            sql: `SELECT id_progreso FROM progreso_actividad WHERE id_usuario = ? AND id_actividad = ?`,
            args: [userId, primeraActividadId],
          });

          if (existingActivity.rows.length === 0) {
            await db.execute({
              sql: `INSERT INTO progreso_actividad (id_progreso, id_usuario, id_actividad, estado, mejor_puntaje) 
                    VALUES (?, ?, ?, 'disponible', 0)`,
              args: [uuid(), userId, primeraActividadId],
            });
          }
        }
      }
    } catch (error) {
      console.error("Error crítico al inicializar el progreso del usuario:", error);
      throw new Error('REGISTRATION_FAILED');
    }

    // 5. Obtener perfil completo del usuario
    const userFullProfile = await getUserProfile(userId);

    return {
      accessToken,
      refreshToken,
      user: userFullProfile,
    };
  } catch (error: any) {
    // Si falla, limpiar el usuario si fue creado
    try {
      await db.execute({
        sql: `DELETE FROM usuarios WHERE id = ?`,
        args: [userId],
      });
    } catch (deleteError) {
      console.error('Error limpiando usuario fallido:', deleteError);
    }
    throw error;
  }
}

export async function registerUser(data: {
  email: string;
  password: string;
  nombre: string;
}): Promise<AuthResponse> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return createUserWithSessionTokens(data.email, data.nombre, hashedPassword);
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

/**
 * Crea una solicitud de registro que requiere confirmación por email
 * Retorna el token de confirmación a enviar por correo
 */
export async function requestRegistrationConfirmation(data: {
  email: string;
  password: string;
  nombre: string;
}): Promise<string> {
  // Verificar que el nombre de usuario no esté en uso
  // (Los emails SÍ pueden repetirse según el modelo de la app)
  const existingNombre = await db.execute({
    sql: `SELECT id FROM usuarios WHERE nombre = ?`,
    args: [data.nombre],
  });

  if (existingNombre.rows.length > 0) {
    throw new Error('Username already taken');
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Crear solicitud de confirmación (retorna token)
  const confirmationToken = createConfirmationRequest(
    data.email,
    data.nombre,
    hashedPassword
  );

  return confirmationToken;
}

/**
 * Confirma el registro con el token recibido por email
 * Crea el usuario en la base de datos y retorna tokens de sesión
 */
export async function confirmRegistrationWithToken(token: string): Promise<AuthResponse> {
  try {
    // Verificar y decodificar token de confirmación
    const confirmation = confirmRegistration(token);

    if (!confirmation) {
      throw new Error('TOKEN_EXPIRED');
    }

    // Delegar la creación de usuario a la función auxiliar
    const result = await createUserWithSessionTokens(confirmation.email, confirmation.nombre, confirmation.password);
    return result;
  } catch (error: any) {
    // Propagar errores específicos sin modificar
    if (error.message === 'TOKEN_EXPIRED' || error.message === 'USERNAME_TAKEN') {
      throw error;
    }
    
    // Cualquier otro error (progreso_nodo, etc) es falla de creación
    throw new Error('REGISTRATION_FAILED');
  }
}