import { db } from '../../db/client';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

/**
 * Calcula el nivel actual basado en la última actividad completada
 * Formato: nodo_orden.actividad_orden (ej: 2.1)
 */
async function calculateCurrentLevel(userId: string): Promise<string> {
  try {
    // Obtener la actividad completada más avanzada (mayor orden_secuencial en mayor nodo)
    const result = await db.execute({
      sql: `
        SELECT 
          n.orden_secuencial as nodo_orden,
          a.orden_secuencial as actividad_orden
        FROM progreso_actividad pa
        JOIN actividad a ON pa.id_actividad = a.id_actividad
        JOIN nodo n ON a.id_nodo = n.id_nodo
        WHERE pa.id_usuario = ? AND pa.estado = 'completada'
        ORDER BY n.orden_secuencial DESC, a.orden_secuencial DESC
        LIMIT 1
      `,
      args: [userId],
    });

    if (result.rows.length === 0) {
      return '0.0';
    }

    const row = result.rows[0] as any;
    return `${row.nodo_orden}.${row.actividad_orden}`;
  } catch {
    return '0.0';
  }
}

/**
 * Obtiene los datos de un usuario por ID
 */
export async function getUserById(userId: string) {
  const result = await db.execute({
    sql: 'SELECT id, email, nombre, rol, activo, monedas_virtuales, experiencia_total, nivel_actual, created_at FROM usuarios WHERE id = ?',
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
  const currentLevel = await calculateCurrentLevel(userId);

  // Obtenemos solo los items que el usuario tiene EQUIPADOS
  // Unimos con la tabla 'item' para saber el 'tipo' (base, clothing, etc.)
  const equippedResult = await db.execute({
    sql: `
      SELECT i.id_item, i.tipo 
      FROM usuario_item ui
      JOIN item i ON ui.id_item = i.id_item
      WHERE ui.id_usuario = ? AND ui.equipado = true
    `,
    args: [userId],
  });

  // Transformamos la lista en un objeto organizado por tipo
  const equipped: Record<string, string | null> = {
    base: 'mono_robot', // Default por si no tiene nada
    expression: null,
    clothing: null,
    accessory: null
  };

  equippedResult.rows.forEach((row: any) => {
    equipped[row.tipo] = row.id_item;
  });

  const statsResult = await db.execute({
    sql: `SELECT SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as completadas,
                 AVG(mejor_puntaje) as puntaje_promedio
          FROM progreso_actividad WHERE id_usuario = ?`,
    args: [userId],
  });

  const stats = statsResult.rows[0] as any;

  return {
    ...user,
    nivel_actual: currentLevel,
    equipped,
    estadisticas: {
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
  // Obtener progreso por actividad (estado) si la tabla existe
  const progresoRes = await db.execute({
    sql: `
      SELECT id_progreso, id_usuario, id_actividad, estado
      FROM progreso_actividad
      WHERE id_usuario = ?
    `,
    args: [userId],
  });

  // Intentos / historial
  const intentosRes = await db.execute({
    sql: `
      SELECT
        ia.id_intento as id,
        ia.id_actividad as actividad_id,
        a.tipo_actividad,
        n.titulo as nodo_titulo,
        ia.puntaje_obtenido as puntaje,
        ia.detalle_respuestas as detalle,
        ia.fecha_hora as creado_en
      FROM intento_actividad ia
      LEFT JOIN actividad a ON ia.id_actividad = a.id_actividad
      LEFT JOIN nodo n ON a.id_nodo = n.id_nodo
      WHERE ia.id_usuario = ?
      ORDER BY ia.fecha_hora DESC
    `,
    args: [userId],
  });

  return {
    progreso: progresoRes.rows || [],
    intentos: intentosRes.rows || [],
  };
}
