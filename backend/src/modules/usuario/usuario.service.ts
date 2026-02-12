import { db } from '../../db/client';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

/**
 * Obtiene los datos de un usuario por ID
 */
export async function getUserById(userId: string) {
  const result = await db.execute({
    sql: 'SELECT id, email, nombre, rol, activo, created_at FROM usuarios WHERE id = ?',
    args: [userId],
  });

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  return result.rows[0];
}

/**
 * Obtiene el perfil completo del usuario autenticado
 */
export async function getUserProfile(userId: string) {
  const user = await getUserById(userId);

  // Obtener estadísticas del usuario
  const statsResult = await db.execute({
    sql: `
      SELECT 
        COUNT(*) as total_lecciones,
        SUM(CASE WHEN estado = 'completado' THEN 1 ELSE 0 END) as completadas,
        AVG(puntaje) as puntaje_promedio
      FROM progreso
      WHERE usuario_id = ?
    `,
    args: [userId],
  });

  const stats = statsResult.rows[0] as any;

  return {
    ...user,
    estadisticas: {
      totalLecciones: stats?.total_lecciones || 0,
      leccionesCompletadas: stats?.completadas || 0,
      puntajePromedio: stats?.puntaje_promedio ? parseFloat(stats.puntaje_promedio) : 0,
    },
  };
}

/**
 * Actualiza los datos de un usuario
 */
export async function updateUser(
  userId: string,
  data: {
    nombre?: string;
    email?: string;
    password?: string;
  }
) {
  // Verificar que el usuario existe
  await getUserById(userId);

  // Variables para la actualización
  let updateFields: string[] = [];
  let updateArgs: any[] = [];

  if (data.nombre !== undefined) {
    updateFields.push('nombre = ?');
    updateArgs.push(data.nombre);
  }

  if (data.email !== undefined) {
    updateFields.push('email = ?');
    updateArgs.push(data.email);
  }

  if (data.password !== undefined) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    updateFields.push('password = ?');
    updateArgs.push(hashedPassword);
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  updateArgs.push(userId);

  if (updateFields.length === 1) {
    throw new Error('No hay campos para actualizar');
  }

  await db.execute({
    sql: `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`,
    args: updateArgs,
  });

  return getUserById(userId);
}

/**
 * Desactiva (pero no borra) un usuario
 */
export async function deleteUser(userId: string) {
  await db.execute({
    sql: 'UPDATE usuarios SET activo = false WHERE id = ?',
    args: [userId],
  });

  return { message: `Usuario ${userId} desactivado correctamente` };
}

/**
 * Obtiene el progreso del usuario
 */
export async function getUserProgress(userId: string) {
  const result = await db.execute({
    sql: `
      SELECT 
        p.id,
        p.leccion_id,
        l.titulo,
        l.dificultad,
        p.estado,
        p.puntaje,
        p.intentos,
        p.completed_at,
        p.created_at
      FROM progreso p
      LEFT JOIN lecciones l ON p.leccion_id = l.id
      WHERE p.usuario_id = ?
      ORDER BY p.created_at DESC
    `,
    args: [userId],
  });

  return result.rows;
}
