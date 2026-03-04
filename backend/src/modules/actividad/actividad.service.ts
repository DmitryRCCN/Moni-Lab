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

// NOTE: getPreguntasByEjercicio removed (replaced by getPreguntasByEjercicio that uses intento congelado)
// --- NUEVAS FUNCIONES: intento congelado y actualización final ---
export async function getOrCreateIntento(id_usuario: string, id_actividad: string) {
  // A. Buscar intento abierto
  const existing = await db.execute({
    sql: `SELECT * FROM intento_actividad WHERE id_usuario = ? AND id_actividad = ? AND puntaje_obtenido IS NULL LIMIT 1`,
    args: [id_usuario, id_actividad],
  });

  if (existing.rows && existing.rows.length > 0) return existing.rows[0];

  // B. Obtener configuración básica (es_aleatorio, topico)
  const configRes = await db.execute({
    sql: `SELECT a.es_aleatorio, n.topico FROM actividad a JOIN ejercicio e ON a.id_actividad = e.id_actividad JOIN nodo n ON a.id_nodo = n.id_nodo WHERE a.id_actividad = ?`,
    args: [id_actividad],
  });

  const config: any = configRes.rows && configRes.rows[0] ? configRes.rows[0] : { es_aleatorio: false, topico: null };

  let preguntasIds: string[] = [];

  if (config.es_aleatorio) {
    const limit = 5;
    const randomRes = await db.execute({
      sql: `SELECT id_pregunta FROM pregunta WHERE topico = ? ORDER BY RANDOM() LIMIT ?`,
      args: [config.topico, limit],
    });
    preguntasIds = (randomRes.rows || []).map((r: any) => r.id_pregunta);
  } else {
    const fixedRes = await db.execute({ sql: `SELECT id_pregunta FROM ejercicio_pregunta WHERE id_actividad = ?`, args: [id_actividad] });
    preguntasIds = (fixedRes.rows || []).map((r: any) => r.id_pregunta);
  }

  if (!preguntasIds || preguntasIds.length === 0) throw new Error('No hay preguntas disponibles para este ejercicio');

  const id_intento = uuid();
  const detalle_inicial = JSON.stringify(preguntasIds.map(id => ({ id_pregunta: id, respuesta_usuario: null, es_correcta: null })));

  await db.execute({
    sql: `INSERT INTO intento_actividad (id_intento, id_usuario, id_actividad, detalle_respuestas) VALUES (?, ?, ?, ?)`,
    args: [id_intento, id_usuario, id_actividad, detalle_inicial],
  });

  return { id_intento, id_usuario, id_actividad, detalle_respuestas: detalle_inicial };
}

export async function getPreguntasByEjercicio(id_actividad: string, id_usuario: string) {
  const intento: any = await getOrCreateIntento(id_usuario, id_actividad);
  const detalle = intento.detalle_respuestas ? JSON.parse(intento.detalle_respuestas) : [];
  const ids = detalle.map((d: any) => d.id_pregunta).filter(Boolean);

  if (ids.length === 0) return { id_intento: intento.id_intento, preguntas: [] };

  const placeholders = ids.map(() => '?').join(',');
  const result = await db.execute({
    sql: `SELECT id_pregunta, enunciado, tipo_pregunta, nivel_dificultad, opciones, topico, puntos, respuesta_correcta FROM pregunta WHERE id_pregunta IN (${placeholders})`,
    args: ids,
  });

  const preguntasMap = new Map((result.rows || []).map((p: any) => [p.id_pregunta, p]));
  const preguntasOrdenadas = ids.map((i: string) => preguntasMap.get(i)).filter(Boolean);

  return { id_intento: intento.id_intento, preguntas: preguntasOrdenadas };
}

export async function updateIntentoFinal(id_usuario: string, data: { id_actividad: string; puntaje_obtenido: number; detalle_respuestas: string }) {
  // Buscar intento abierto
  const current = await db.execute({ sql: `SELECT id_intento FROM intento_actividad WHERE id_usuario = ? AND id_actividad = ? AND puntaje_obtenido IS NULL`, args: [id_usuario, data.id_actividad] });
  if (!current.rows || current.rows.length === 0) throw new Error('No hay un intento activo para finalizar');
  const id_intento = current.rows[0].id_intento;

  await db.execute({ sql: `UPDATE intento_actividad SET puntaje_obtenido = ?, detalle_respuestas = ?, fecha_hora = CURRENT_TIMESTAMP WHERE id_intento = ?`, args: [data.puntaje_obtenido, data.detalle_respuestas, id_intento] });

  // Reutilizar lógica de premios y progreso
  let awardedCoins = 0;
  try {
    const ejercicioRes = await db.execute({ sql: `SELECT minimo_aprobatorio FROM ejercicio WHERE id_actividad = ?`, args: [data.id_actividad] });
    const actividadRes = await db.execute({ sql: `SELECT puntos_otorgados FROM actividad WHERE id_actividad = ?`, args: [data.id_actividad] });
      const minimoRaw = ejercicioRes.rows[0]?.minimo_aprobatorio ?? null;
      const puntosOtorgadosRaw = actividadRes.rows[0]?.puntos_otorgados ?? 0;
      const minimo = minimoRaw !== null ? Number(minimoRaw) : null;
      const puntosOtorgados = Number(puntosOtorgadosRaw) || 0;

      if (minimo !== null && data.puntaje_obtenido !== undefined && data.puntaje_obtenido !== null) {
        if (Number(data.puntaje_obtenido) >= minimo) {
        const prev = await db.execute({ sql: `SELECT estado FROM progreso_actividad WHERE id_usuario = ? AND id_actividad = ?`, args: [id_usuario, data.id_actividad] });
        const prevEstado = prev.rows[0]?.estado ?? null;

        if (!prev.rows || prev.rows.length === 0) {
          const idp = uuid();
          await db.execute({ sql: `INSERT INTO progreso_actividad (id_progreso, id_usuario, id_actividad, estado, mejor_puntaje) VALUES (?, ?, ?, 'completada', ?)`, args: [idp, id_usuario, data.id_actividad, Number(data.puntaje_obtenido)] });
        } else {
          await db.execute({ sql: `UPDATE progreso_actividad SET estado = 'completada', mejor_puntaje = ? WHERE id_usuario = ? AND id_actividad = ?`, args: [Number(data.puntaje_obtenido), id_usuario, data.id_actividad] });
        }

        if (prevEstado !== 'completada' && puntosOtorgados > 0) {
          await db.execute({ sql: `UPDATE usuarios SET monedas_virtuales = COALESCE(monedas_virtuales,0) + ? WHERE id = ?`, args: [puntosOtorgados, id_usuario] });
          awardedCoins = puntosOtorgados;
        }
      }
    }
  } catch (e) {
    console.warn('Error updating progreso or awarding coins:', e);
  }

  const updated = await db.execute({ sql: `SELECT monedas_virtuales FROM usuarios WHERE id = ?`, args: [id_usuario] });
  const monedas_restantes = updated.rows[0]?.monedas_virtuales ?? null;

  return { id_intento, awardedCoins, monedas_restantes };
}

export async function completeLectura(id_usuario: string, id_actividad: string) {
  const id = uuid();
  // obtener puntos otorgados por la actividad
  const actividadRes = await db.execute({ sql: `SELECT puntos_otorgados FROM actividad WHERE id_actividad = ?`, args: [id_actividad] });
  const puntosOtorgados = Number(actividadRes.rows[0]?.puntos_otorgados ?? 0);

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

