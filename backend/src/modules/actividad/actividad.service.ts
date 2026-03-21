import { db } from '../../db/client';
import { v4 as uuid } from 'uuid';

export async function getActividadById(id: string) {
  // Obtener información básica de la actividad
  const actividadBasic = await db.execute({
    sql: `SELECT a.id_actividad, a.tipo_actividad, a.puntos_otorgados, a.es_aleatorio, a.orden_secuencial FROM actividad a WHERE a.id_actividad = ?`,
    args: [id],
  });

  if (!actividadBasic.rows || actividadBasic.rows.length === 0) {
    throw new Error('Actividad no encontrada');
  }

  const actividad = actividadBasic.rows[0];

  // Obtener id_nodo de manera segura
  const nodoInfo = await db.execute({
    sql: `SELECT a.id_nodo FROM actividad a WHERE a.id_actividad = ?`,
    args: [id],
  });

  const id_nodo = nodoInfo.rows[0]?.id_nodo;

  // Obtener información específica según el tipo de actividad
  let lectura = null;
  let ejercicio = null;
  let minijuego = null;

  if (actividad.tipo_actividad === 'lectura') {
    const lecturaRes = await db.execute({
      sql: `SELECT cuerpo_texto, url_multimedia FROM lectura WHERE id_actividad = ?`,
      args: [id],
    });
    if (lecturaRes.rows && lecturaRes.rows.length > 0) {
      const l = lecturaRes.rows[0];
      lectura = { cuerpo_texto: l.cuerpo_texto, url_multimedia: l.url_multimedia };
    }
  } else if (actividad.tipo_actividad === 'ejercicio') {
    const ejercicioRes = await db.execute({
      sql: `SELECT nivel_dificultad, minimo_aprobatorio, es_de_salto FROM ejercicio WHERE id_actividad = ?`,
      args: [id],
    });
    if (ejercicioRes.rows && ejercicioRes.rows.length > 0) {
      const e = ejercicioRes.rows[0];
      ejercicio = { nivel_dificultad: e.nivel_dificultad, minimo_aprobatorio: e.minimo_aprobatorio, es_de_salto: !!e.es_de_salto };
    }
  } else if (actividad.tipo_actividad === 'minijuego') {
    const minijuegoRes = await db.execute({
      sql: `SELECT titulo_pantalla, historia_intro, config_json, retroalimentacion_json FROM minijuego WHERE id_actividad = ?`,
      args: [id],
    });
    if (minijuegoRes.rows && minijuegoRes.rows.length > 0) {
      const m = minijuegoRes.rows[0];
      minijuego = {
        titulo_pantalla: m.titulo_pantalla,
        historia_intro: m.historia_intro,
        config_json: m.config_json,
        retroalimentacion_json: m.retroalimentacion_json,
      };
    }
  }

  return {
    id_actividad: actividad.id_actividad,
    id_nodo,
    tipo_actividad: actividad.tipo_actividad,
    puntos_otorgados: actividad.puntos_otorgados,
    es_aleatorio: !!actividad.es_aleatorio,
    orden_secuencial: actividad.orden_secuencial,
    lectura,
    ejercicio,
    minijuego,
  };
}

// NOTE: getPreguntasByEjercicio removed (replaced by getPreguntasByEjercicio that uses intento congelado)
// --- NUEVAS FUNCIONES: intento congelado y actualización final ---

// Función auxiliar para verificar si el usuario completó todas las actividades previas del nodo
async function hasCompletedPreviousActivities(id_usuario: string, id_actividad: string): Promise<boolean> {
  // Obtener id_nodo de manera segura
  const nodoInfo = await db.execute({
    sql: `SELECT a.id_nodo FROM actividad a WHERE a.id_actividad = ?`,
    args: [id_actividad],
  });

  const id_nodo = nodoInfo.rows[0]?.id_nodo;

  if (!id_nodo) return false;

  // Obtener todas las actividades del nodo excepto la actual
  const allActivities = await db.execute({
    sql: `SELECT a.id_actividad FROM actividad a WHERE a.id_nodo = ? AND a.id_actividad != ?`,
    args: [id_nodo, id_actividad],
  });

  if (!allActivities.rows || allActivities.rows.length === 0) {
    return true; // No hay otras actividades, entonces todas están "completadas"
  }

  const allIds = allActivities.rows.map((r: any) => r.id_actividad);
  const placeholders = allIds.map(() => '?').join(',');

  // Verificar si TODAS las otras actividades están completadas
  const completedCount = await db.execute({
    sql: `
      SELECT COUNT(*) as count
      FROM progreso_actividad
      WHERE id_usuario = ? AND id_actividad IN (${placeholders}) AND estado = 'completada'
    `,
    args: [id_usuario, ...allIds],
  });

  const rowsCount = completedCount.rows[0]?.count ?? 0;
  return rowsCount === allIds.length;
}

export async function getOrCreateIntento(id_usuario: string, id_actividad: string) {
  // A. Buscar intento abierto
  const existing = await db.execute({
    sql: `SELECT * FROM intento_actividad WHERE id_usuario = ? AND id_actividad = ? AND puntaje_obtenido IS NULL LIMIT 1`,
    args: [id_usuario, id_actividad],
  });

  if (existing.rows && existing.rows.length > 0) {
    const existingRecord = existing.rows[0];
    // Si ya existe, parsear el detalle para obtener el modo
    const detalle = existingRecord.detalle_respuestas ? JSON.parse(existingRecord.detalle_respuestas) : {};
    return { ...existingRecord, modo: detalle.modo || 'NORMAL' };
  }

  // B. Obtener configuración básica (es_aleatorio, topico, es_de_salto, jump configs)
  // Primero obtener información básica de la actividad
  const actividadRes = await db.execute({
    sql: `SELECT a.es_aleatorio, a.id_nodo FROM actividad a WHERE a.id_actividad = ?`,
    args: [id_actividad],
  });

  if (!actividadRes.rows || actividadRes.rows.length === 0) {
    throw new Error('Actividad no encontrada');
  }

  const actividad = actividadRes.rows[0];
  const id_nodo = actividad.id_nodo;
  const es_aleatorio = actividad.es_aleatorio;

  // Obtener topico del nodo
  const nodoRes = await db.execute({
    sql: `SELECT n.topico FROM nodo n WHERE n.id_nodo = ?`,
    args: [id_nodo],
  });

  const topico = nodoRes.rows[0]?.topico || null;

  // Obtener información del ejercicio
  const ejercicioRes = await db.execute({
    sql: `SELECT e.es_de_salto, e.cantidad_preguntas, e.dificultad_min, e.jump_cantidad_preguntas, e.jump_dificultad_min FROM ejercicio e WHERE e.id_actividad = ?`,
    args: [id_actividad],
  });

  const ejercicio = ejercicioRes.rows[0] || {};

  const config = {
    es_aleatorio,
    topico,
    es_de_salto: ejercicio.es_de_salto || false,
    cantidad_preguntas: ejercicio.cantidad_preguntas || 5,
    dificultad_min: ejercicio.dificultad_min || 1,
    jump_cantidad_preguntas: ejercicio.jump_cantidad_preguntas || 15,
    jump_dificultad_min: ejercicio.jump_dificultad_min || 2,
  };

  // Determinar el modo si es examen de salto
  let modo = 'NORMAL';
  let cantidadPreguntas = config.cantidad_preguntas || 5;
  let dificultadMin = config.dificultad_min || 1;

  if (config.es_de_salto) {
    const completedPrevious = await hasCompletedPreviousActivities(id_usuario, id_actividad);
    if (!completedPrevious) {
      modo = 'SALTO';
      cantidadPreguntas = config.jump_cantidad_preguntas || 15;
      dificultadMin = config.jump_dificultad_min || 2;
    }
  }

  let preguntasIds: string[] = [];

  if (config.es_aleatorio) {
    // Para ejercicios aleatorios, usar la cantidad de preguntas según el modo
    let sql = `SELECT id_pregunta FROM pregunta`;
    let args: any[] = [];

    if (modo === 'NORMAL') {
      // Para modo NORMAL, filtrar por tópico del nodo
      sql += ` WHERE topico = ?`;
      args.push(config.topico);
    } else {
      // Para modo SALTO, no filtrar por tópico, pero sí por dificultad mínima
      sql += ` WHERE nivel_dificultad >= ?`;
      args.push(dificultadMin);
    }

    sql += ` ORDER BY RANDOM() LIMIT ?`;
    args.push(cantidadPreguntas);

    const randomRes = await db.execute({ sql, args });
    preguntasIds = (randomRes.rows || []).map((r: any) => r.id_pregunta);
  } else {
    const fixedRes = await db.execute({ sql: `SELECT id_pregunta FROM ejercicio_pregunta WHERE id_actividad = ?`, args: [id_actividad] });
    preguntasIds = (fixedRes.rows || []).map((r: any) => r.id_pregunta);

    // Si no hay preguntas enlazadas y es ejercicio de salto, entonces se toma un fallback:
    if (config.es_de_salto && preguntasIds.length === 0) {
      const switchCantidad = modo === 'SALTO' ? config.jump_cantidad_preguntas : config.cantidad_preguntas;
      const switchDificultad = modo === 'SALTO' ? config.jump_dificultad_min : config.dificultad_min;

      // 1) Buscar preguntas agrupadas por nodo (las que pertenecen a las actividades del mismo nodo)
      const fallbackPorNodo = await db.execute({
        sql: `
          SELECT p.id_pregunta
          FROM pregunta p
          JOIN ejercicio_pregunta ep ON ep.id_pregunta = p.id_pregunta
          JOIN actividad a ON a.id_actividad = ep.id_actividad
          WHERE a.id_nodo = ? AND p.nivel_dificultad >= ?
          ORDER BY RANDOM() LIMIT ?
        `,
        args: [id_nodo, switchDificultad, switchCantidad],
      });
      preguntasIds = (fallbackPorNodo.rows || []).map((r: any) => r.id_pregunta);

      // 2) Si sigue vacío, intentar por tópico de nodo (caso de topicos “multi”) y dificultad
      if (preguntasIds.length === 0 && config.topico) {
        const fallbackPorTopico = await db.execute({
          sql: `SELECT id_pregunta FROM pregunta WHERE topico = ? AND nivel_dificultad >= ? ORDER BY RANDOM() LIMIT ?`,
          args: [config.topico, switchDificultad, switchCantidad],
        });
        preguntasIds = (fallbackPorTopico.rows || []).map((r: any) => r.id_pregunta);
      }

      // 3) Si sigue vacío, usar pool general por dificultad (para no bloquear)
      if (preguntasIds.length === 0) {
        const fallbackGeneral = await db.execute({
          sql: `SELECT id_pregunta FROM pregunta WHERE nivel_dificultad >= ? ORDER BY RANDOM() LIMIT ?`,
          args: [switchDificultad, switchCantidad],
        });
        preguntasIds = (fallbackGeneral.rows || []).map((r: any) => r.id_pregunta);
      }

      // En la parte de los fallbacks de SALTO:
      if (preguntasIds.length === 0) {
        // Si no hay de nivel 2, bajamos a nivel 1 automáticamente para no romper el juego
        console.warn(`[SALTO] No se hallaron preguntas nivel ${switchDificultad}, bajando exigencia...`);
        
        const fallbackFlexible = await db.execute({
          sql: `SELECT id_pregunta FROM pregunta WHERE topico = ? OR nivel_dificultad >= 1 ORDER BY RANDOM() LIMIT ?`,
          args: [config.topico, switchCantidad],
        });
        preguntasIds = (fallbackFlexible.rows || []).map((r: any) => r.id_pregunta);
      }

      if (preguntasIds.length > 0) {
        
        console.debug(`[SALTO] Fallback de preguntas para actividad ${id_actividad}: seleccionados ${preguntasIds.length} preguntas con modo ${modo}`);
      }
    }
  }

  if (!preguntasIds || preguntasIds.length === 0) {
    console.error(`[SALTO] No hay preguntas disponibles para actividad ${id_actividad}`);

    throw new Error('No hay preguntas disponibles para este ejercicio');
  }

  const id_intento = uuid();
  // Incluir el modo en el detalle_respuestas como un campo especial
  const detalle_inicial = JSON.stringify({ modo, preguntas: preguntasIds.map(id => ({ id_pregunta: id, respuesta_usuario: null, es_correcta: null })) });

  await db.execute({
    sql: `INSERT INTO intento_actividad (id_intento, id_usuario, id_actividad, detalle_respuestas) VALUES (?, ?, ?, ?)`,
    args: [id_intento, id_usuario, id_actividad, detalle_inicial],
  });

  return { id_intento, id_usuario, id_actividad, detalle_respuestas: detalle_inicial, modo };
}

export async function getPreguntasByEjercicio(id_actividad: string, id_usuario: string) {
  const intento: any = await getOrCreateIntento(id_usuario, id_actividad);
  
  // Parsear el detalle_respuestas que ahora tiene estructura { modo, preguntas }
  let detalle = [];
  let modo = 'NORMAL';
  
  if (intento.detalle_respuestas) {
    const parsed = JSON.parse(intento.detalle_respuestas);
    if (parsed.modo) {
      modo = parsed.modo;
      detalle = parsed.preguntas || [];
    } else {
      // Compatibilidad con formato antiguo
      detalle = Array.isArray(parsed) ? parsed : [];
    }
  }
  
  const ids = detalle.map((d: any) => d.id_pregunta).filter(Boolean);

  if (ids.length === 0) return { id_intento: intento.id_intento, preguntas: [], modo };

  const placeholders = ids.map(() => '?').join(',');
  const result = await db.execute({
    sql: `SELECT id_pregunta, enunciado, tipo_pregunta, nivel_dificultad, opciones, topico, puntos, respuesta_correcta FROM pregunta WHERE id_pregunta IN (${placeholders})`,
    args: ids,
  });

  const preguntasMap = new Map((result.rows || []).map((p: any) => [p.id_pregunta, p]));
  const preguntasOrdenadas = ids.map((i: string) => preguntasMap.get(i)).filter(Boolean);

  return { id_intento: intento.id_intento, preguntas: preguntasOrdenadas, modo };
}

export async function updateIntentoFinal(id_usuario: string, data: { id_actividad: string; puntaje_obtenido: number; detalle_respuestas: string }) {
  // Buscar intento abierto
  const current = await db.execute({ sql: `SELECT id_intento FROM intento_actividad WHERE id_usuario = ? AND id_actividad = ? AND puntaje_obtenido IS NULL`, args: [id_usuario, data.id_actividad] });
  let id_intento: string;
  if (!current.rows || current.rows.length === 0) {
    // Crear un nuevo intento si no existe uno abierto
    id_intento = uuid();
    await db.execute({
      sql: `INSERT INTO intento_actividad (id_intento, id_usuario, id_actividad, detalle_respuestas, puntaje_obtenido, fecha_hora) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      args: [id_intento, id_usuario, data.id_actividad, data.detalle_respuestas, data.puntaje_obtenido]
    });
  } else {
    id_intento = current.rows[0].id_intento;
    await db.execute({ sql: `UPDATE intento_actividad SET puntaje_obtenido = ?, detalle_respuestas = ?, fecha_hora = CURRENT_TIMESTAMP WHERE id_intento = ?`, args: [data.puntaje_obtenido, data.detalle_respuestas, id_intento] });
  }

  // Reutilizar lógica de premios y progreso
  let awardedCoins = 0;
  try {
    const actividadRes = await db.execute({ sql: `SELECT tipo_actividad, puntos_otorgados FROM actividad WHERE id_actividad = ?`, args: [data.id_actividad] });
    const tipoActividad = actividadRes.rows[0]?.tipo_actividad ?? null;
    const puntosOtorgados = Number(actividadRes.rows[0]?.puntos_otorgados ?? 0);
    
    // Obtener id_nodo de manera segura
    const nodoRes = await db.execute({ 
      sql: `SELECT a.id_nodo FROM actividad a WHERE a.id_actividad = ?`, 
      args: [data.id_actividad] 
    });
    const id_nodo = nodoRes.rows[0]?.id_nodo ?? null;

    // Para minijuegos, siempre actualizar progreso si el intento está completado
    // Para ejercicios, usar minimo_aprobatorio
    let debeActualizar = false;

    if (tipoActividad === 'minijuego') {
      // Para minijuegos, cualquier puntaje >= 0 significa que se completó
      debeActualizar = data.puntaje_obtenido !== undefined && data.puntaje_obtenido !== null && Number(data.puntaje_obtenido) >= 0;
    } else if (tipoActividad === 'ejercicio') {
      // Para ejercicios, verificar el mínimo aprobatorio
      const ejercicioRes = await db.execute({ sql: `SELECT minimo_aprobatorio, es_de_salto FROM ejercicio WHERE id_actividad = ?`, args: [data.id_actividad] });
      const minimoRaw = ejercicioRes.rows[0]?.minimo_aprobatorio ?? null;
      const esDeSlato = ejercicioRes.rows[0]?.es_de_salto ?? false;
      const minimo = minimoRaw !== null ? Number(minimoRaw) : null;
      debeActualizar = minimo !== null && data.puntaje_obtenido !== undefined && data.puntaje_obtenido !== null && Number(data.puntaje_obtenido) >= minimo;

      // Si es un examen de salto y el usuario lo aprobó, marcar todas las actividades del nodo como completadas
      if (debeActualizar && esDeSlato && id_nodo) {
        console.log(`[🚀 SALTO] Usuario ${id_usuario} aprobó examen de salto en actividad ${data.id_actividad}. Marcando todas las actividades del nodo ${id_nodo} como completadas.`);
        
        // Obtener todas las actividades del nodo (excepto la actual)
        const allActivitiesRes = await db.execute({
          sql: `SELECT id_actividad FROM actividad WHERE id_nodo = ? AND id_actividad != ?`,
          args: [id_nodo, data.id_actividad],
        });

        const allActivities = allActivitiesRes.rows || [];
        
        // Insertar/actualizar el progreso de todas las actividades como completadas
        for (const activity of allActivities) {
          const actId = activity.id_actividad;
          
          // Verificar si ya existe registro de progreso
          const existingProgress = await db.execute({
            sql: `SELECT id_progreso FROM progreso_actividad WHERE id_usuario = ? AND id_actividad = ?`,
            args: [id_usuario, actId],
          });

          if (!existingProgress.rows || existingProgress.rows.length === 0) {
            // Insertar nuevo registro
            const idp = uuid();
            await db.execute({
              sql: `INSERT INTO progreso_actividad (id_progreso, id_usuario, id_actividad, estado, mejor_puntaje) VALUES (?, ?, ?, 'completada', 100)`,
              args: [idp, id_usuario, actId],
            });
          } else {
            // Actualizar solo si no estaba completada
            await db.execute({
              sql: `UPDATE progreso_actividad SET estado = 'completada', mejor_puntaje = 100 WHERE id_usuario = ? AND id_actividad = ? AND estado != 'completada'`,
              args: [id_usuario, actId],
            });
          }
        }
      }
    }

    if (debeActualizar) {
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

