import { db } from '../../db/client';
import { v4 as uuid } from 'uuid';

export async function getActividadById(id: string) {
  const result = await db.execute({
    sql: `
      SELECT a.id_actividad, a.id_nodo, a.tipo_actividad, a.puntos_otorgados, a.es_aleatorio, a.orden_secuencial,
             l.cuerpo_texto, l.url_multimedia,
             e.nivel_dificultad, e.minimo_aprobatorio, e.es_de_salto
      FROM actividad a
      LEFT JOIN lectura l ON l.id_actividad = a.id_actividad
      LEFT JOIN ejercicio e ON e.id_actividad = a.id_actividad
      WHERE a.id_actividad = ?
    `,
    args: [id],
  });

  if (!result.rows || result.rows.length === 0) {
    throw new Error('Actividad no encontrada');
  }

  const r: any = result.rows[0];
  return {
    id_actividad: r.id_actividad,
    id_nodo: r.id_nodo,
    tipo_actividad: r.tipo_actividad,
    puntos_otorgados: r.puntos_otorgados,
    es_aleatorio: !!r.es_aleatorio,
    orden_secuencial: r.orden_secuencial,
    lectura: r.cuerpo_texto ? { cuerpo_texto: r.cuerpo_texto, url_multimedia: r.url_multimedia } : null,
    ejercicio: r.nivel_dificultad ? { nivel_dificultad: r.nivel_dificultad, minimo_aprobatorio: r.minimo_aprobatorio, es_de_salto: !!r.es_de_salto } : null,
  };
}

export async function getPreguntasByEjercicio(id_actividad: string) {
  const result = await db.execute({
    sql: `
      SELECT p.id_pregunta, p.enunciado, p.tipo_pregunta, p.nivel_dificultad, p.respuesta_correcta, p.opciones, p.topico, p.puntos
      FROM pregunta p
      JOIN ejercicio_pregunta ep ON ep.id_pregunta = p.id_pregunta
      WHERE ep.id_actividad = ?
    `,
    args: [id_actividad],
  });

  return result.rows || [];
}
export async function createIntento(data: { id_usuario: string; id_actividad: string; puntaje_obtenido?: number; detalle_respuestas?: string }) {
  const id = uuid();
  await db.execute({
    sql: `INSERT INTO intento_actividad (id_intento, id_usuario, id_actividad, puntaje_obtenido, detalle_respuestas) VALUES (?, ?, ?, ?, ?)`,
    args: [id, data.id_usuario, data.id_actividad, data.puntaje_obtenido ?? null, data.detalle_respuestas ?? null],
  });

  // Si el puntaje alcanza el mínimo del ejercicio, actualizar progreso_actividad y dar monedas si corresponde
  let awardedCoins = 0
  try {
    const ejercicioRes = await db.execute({
      sql: `SELECT minimo_aprobatorio FROM ejercicio WHERE id_actividad = ?`,
      args: [data.id_actividad],
    });

    const actividadRes = await db.execute({
      sql: `SELECT puntos_otorgados FROM actividad WHERE id_actividad = ?`,
      args: [data.id_actividad],
    });

    const minimo = ejercicioRes.rows[0]?.minimo_aprobatorio ?? null;
    const puntosOtorgados = actividadRes.rows[0]?.puntos_otorgados ?? 0;

    if (minimo !== null && data.puntaje_obtenido !== undefined && data.puntaje_obtenido !== null) {
      if (data.puntaje_obtenido >= minimo) {
        // Verificar estado previo
        const prev = await db.execute({
          sql: `SELECT estado FROM progreso_actividad WHERE id_usuario = ? AND id_actividad = ?`,
          args: [data.id_usuario, data.id_actividad],
        });
        const prevEstado = prev.rows[0]?.estado ?? null;

        // Actualizar a completada
        await db.execute({
          sql: `UPDATE progreso_actividad SET estado = 'completada' WHERE id_usuario = ? AND id_actividad = ?`,
          args: [data.id_usuario, data.id_actividad],
        });

        // Si antes no estaba completada, otorgar monedas
        if (prevEstado !== 'completada' && puntosOtorgados > 0) {
          await db.execute({
            sql: `UPDATE usuarios SET monedas_virtuales = COALESCE(monedas_virtuales,0) + ? WHERE id = ?`,
            args: [puntosOtorgados, data.id_usuario],
          });
          awardedCoins = puntosOtorgados
        }
      }
    }
  } catch (e) {
    console.warn('Error updating progreso or awarding coins:', e);
  }

  return { id_intento: id, ...data, awardedCoins };
}

export async function completeLectura(id_usuario: string, id_actividad: string) {
  const id = uuid();
  // obtener puntos otorgados por la actividad
  const actividadRes = await db.execute({ sql: `SELECT puntos_otorgados FROM actividad WHERE id_actividad = ?`, args: [id_actividad] });
  const puntosOtorgados = actividadRes.rows[0]?.puntos_otorgados ?? 0;

  // verificar estado previo
  const prev = await db.execute({ sql: `SELECT estado FROM progreso_actividad WHERE id_usuario = ? AND id_actividad = ?`, args: [id_usuario, id_actividad] });
  const prevEstado = prev.rows[0]?.estado ?? null;

  // si no existe registro de progreso, insertarlo como completado
  if (!prev.rows || prev.rows.length === 0) {
    await db.execute({ sql: `INSERT INTO progreso_actividad (id_progreso, id_usuario, id_actividad, estado, mejor_puntaje) VALUES (?, ?, ?, 'completada', NULL)`, args: [id, id_usuario, id_actividad] });
  } else {
    await db.execute({ sql: `UPDATE progreso_actividad SET estado = 'completada' WHERE id_usuario = ? AND id_actividad = ?`, args: [id_usuario, id_actividad] });
  }

  let awardedCoins = 0;
  if (prevEstado !== 'completada' && puntosOtorgados > 0) {
    await db.execute({ sql: `UPDATE usuarios SET monedas_virtuales = COALESCE(monedas_virtuales,0) + ? WHERE id = ?`, args: [puntosOtorgados, id_usuario] });
    awardedCoins = puntosOtorgados;
  }

  const updated = await db.execute({ sql: `SELECT monedas_virtuales FROM usuarios WHERE id = ?`, args: [id_usuario] });
  const monedas_restantes = updated.rows[0]?.monedas_virtuales ?? null;

  return { awardedCoins, monedas_restantes };
}
