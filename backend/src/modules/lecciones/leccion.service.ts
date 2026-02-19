import { db } from '../../db/client';
import { v4 as uuid } from 'uuid';

interface CreateLeccionData {
  titulo: string;
  descripcion?: string;
  contenido: string;
  dificultad: 'basico' | 'intermedio' | 'avanzado';
  orden: number;
}

/**
 * Obtiene todas las lecciones activas
 */
export async function getAllLecciones() {
  const result = await db.execute({
    sql: `
      SELECT id, titulo, descripcion, dificultad, orden, activo, created_at
      FROM lecciones
      WHERE activo = true
      ORDER BY orden ASC
    `,
  });

  return result.rows;
}

/**
 * Obtiene una lección por ID
 */
export async function getLeccionById(leccionId: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM lecciones WHERE id = ? AND activo = true',
    args: [leccionId],
  });

  if (result.rows.length === 0) {
    throw new Error('Lección no encontrada');
  }

  return result.rows[0];
}

/**
 * Obtiene el contenido completo de una lección
 */
export async function getLeccionContenido(leccionId: string) {
  const leccion = await getLeccionById(leccionId);
  return leccion;
}

/**
 * Crea una nueva lección (solo admin)
 */
export async function createLeccion(data: CreateLeccionData) {
  const id = uuid();

  await db.execute({
    sql: `
      INSERT INTO lecciones (id, titulo, descripcion, contenido, dificultad, orden)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [id, data.titulo, data.descripcion || null, data.contenido, data.dificultad, data.orden],
  });

  return getLeccionById(id);
}

/**
 * Actualiza una lección (solo admin)
 */
export async function updateLeccion(
  leccionId: string,
  data: Partial<CreateLeccionData>
) {
  await getLeccionById(leccionId);

  let updateFields: string[] = [];
  let updateArgs: any[] = [];

  if (data.titulo !== undefined) {
    updateFields.push('titulo = ?');
    updateArgs.push(data.titulo);
  }
  if (data.descripcion !== undefined) {
    updateFields.push('descripcion = ?');
    updateArgs.push(data.descripcion);
  }
  if (data.contenido !== undefined) {
    updateFields.push('contenido = ?');
    updateArgs.push(data.contenido);
  }
  if (data.dificultad !== undefined) {
    updateFields.push('dificultad = ?');
    updateArgs.push(data.dificultad);
  }
  if (data.orden !== undefined) {
    updateFields.push('orden = ?');
    updateArgs.push(data.orden);
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  updateArgs.push(leccionId);

  if (updateFields.length === 1) {
    throw new Error('No hay campos para actualizar');
  }

  await db.execute({
    sql: `UPDATE lecciones SET ${updateFields.join(', ')} WHERE id = ?`,
    args: updateArgs,
  });

  return getLeccionById(leccionId);
}

/**
 * Desactiva una lección (no la borra, por si hay progreso registrado)
 */
export async function deleteLeccion(leccionId: string) {
  await getLeccionById(leccionId);

  await db.execute({
    sql: 'UPDATE lecciones SET activo = false WHERE id = ?',
    args: [leccionId],
  });

  return { message: 'Lección desactivada correctamente' };
}

/**
 * Obtiene estadísticas de una lección
 */
export async function getLeccionStats(leccionId: string) {
  await getLeccionById(leccionId);

  const result = await db.execute({
    sql: `
      SELECT
        COUNT(*) as total_intentos,
        SUM(CASE WHEN estado = 'completado' THEN 1 ELSE 0 END) as completados,
        AVG(puntaje_obtenido) as puntaje_promedio,
        MAX(puntaje_obtenido) as puntaje_maximo,
        MIN(puntaje_obtenido) as puntaje_minimo
      FROM intento_actividad
      WHERE id_actividad = ?
    `,
    args: [leccionId],
  });

  return result.rows[0];
}
