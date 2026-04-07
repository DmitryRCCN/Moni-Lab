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
export async function hasCompletedPreviousActivities(id_usuario: string, id_actividad: string): Promise<boolean> {
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
  // 1. VALIDACIÓN DE SEGURIDAD Y ESTADO
  // Verificamos primero si el usuario tiene permiso para acceder a esta actividad
  const progressCheck = await db.execute({
    sql: `SELECT estado FROM progreso_actividad WHERE id_usuario = ? AND id_actividad = ?`,
    args: [id_usuario, id_actividad],
  });

  const userProgress = progressCheck.rows[0];

  // Si no hay registro o está bloqueada, lanzamos error inmediatamente
  if (!userProgress || userProgress.estado === 'bloqueada') {
    throw new Error('Esta actividad se encuentra bloqueada para tu usuario.');
  }

  const isActivityCompleted = userProgress.estado === 'completada' || userProgress.estado === 'saltada';

  // 2. BUSCAR INTENTO ABIERTO (Solo si no está completada)
  // Si la actividad ya está hecha, no buscamos intentos abiertos, vamos directo a generar uno de "repaso"
  if (!isActivityCompleted) {
    const existing = await db.execute({
      sql: `SELECT * FROM intento_actividad WHERE id_usuario = ? AND id_actividad = ? AND puntaje_obtenido IS NULL LIMIT 1`,
      args: [id_usuario, id_actividad],
    });

    if (existing.rows && existing.rows.length > 0) {
      const existingRecord = existing.rows[0];

      const detalleRaw = existingRecord.detalle_respuestas ? String(existingRecord.detalle_respuestas) : null;
      const detalle = detalleRaw ? JSON.parse(detalleRaw) : {};
      return { ...existingRecord, modo: detalle.modo || 'NORMAL' };
    }
  }

  // 3. OBTENER CONFIGURACIÓN DE LA ACTIVIDAD Y NODO
  const actividadRes = await db.execute({
    sql: `SELECT a.es_aleatorio, a.id_nodo FROM actividad a WHERE a.id_actividad = ?`,
    args: [id_actividad],
  });

  if (!actividadRes.rows || actividadRes.rows.length === 0) {
    throw new Error('La actividad solicitada no existe.');
  }

  const { es_aleatorio, id_nodo } = actividadRes.rows[0];

  const [nodoRes, ejercicioRes] = await Promise.all([
    db.execute({
      sql: `SELECT topico FROM nodo WHERE id_nodo = ?`,
      args: [id_nodo],
    }),
    db.execute({
      sql: `SELECT es_de_salto, cantidad_preguntas, dificultad_min, jump_cantidad_preguntas, jump_dificultad_min FROM ejercicio WHERE id_actividad = ?`,
      args: [id_actividad],
    })
  ]);

  const topico = nodoRes.rows[0]?.topico || null;
  const ejercicio = ejercicioRes.rows[0] || {};

  const config = {
    es_aleatorio,
    topico,
    es_de_salto: !!ejercicio.es_de_salto,
    cantidad_preguntas: ejercicio.cantidad_preguntas || 5,
    dificultad_min: ejercicio.dificultad_min || 1,
    jump_cantidad_preguntas: ejercicio.jump_cantidad_preguntas || 15,
    jump_dificultad_min: ejercicio.jump_dificultad_min || 2,
  };

  // 4. DETERMINAR EL MODO (NORMAL vs SALTO)
  let modo = 'NORMAL';
  let cantidadPreguntas = config.cantidad_preguntas;
  let dificultadMin = config.dificultad_min;

  // Solo se activa el modo SALTO si la actividad es de salto Y NO ha sido completada previamente
  if (config.es_de_salto && !isActivityCompleted) {
    const completedPrevious = await hasCompletedPreviousActivities(id_usuario, id_actividad);
    if (!completedPrevious) {
      modo = 'SALTO';
      cantidadPreguntas = config.jump_cantidad_preguntas;
      dificultadMin = config.jump_dificultad_min;
    }
  }

  // 5. SELECCIÓN DE PREGUNTAS
  let preguntasIds: string[] = [];

  if (config.es_aleatorio) {
    // Modo Aleatorio: Filtrar por tópico o dificultad según el modo
    let sql = `SELECT id_pregunta FROM pregunta`;
    let args: any[] = [];

    if (modo === 'NORMAL') {
      sql += ` WHERE topico = ?`;
      args.push(config.topico);
    } else {
      sql += ` WHERE nivel_dificultad >= ?`;
      args.push(dificultadMin);
    }

    sql += ` ORDER BY RANDOM() LIMIT ?`;
    args.push(cantidadPreguntas);

    const randomRes = await db.execute({ sql, args });
    preguntasIds = (randomRes.rows || []).map((r: any) => r.id_pregunta);
  } else {
    // Modo Fijo: Preguntas enlazadas manualmente
    const fixedRes = await db.execute({ 
      sql: `SELECT id_pregunta FROM ejercicio_pregunta WHERE id_actividad = ?`, 
      args: [id_actividad] 
    });
    preguntasIds = (fixedRes.rows || []).map((r: any) => r.id_pregunta);

    // FALLBACKS para Exámenes de Salto sin preguntas fijas
    if (config.es_de_salto && preguntasIds.length === 0) {
      const switchCantidad = modo === 'SALTO' ? config.jump_cantidad_preguntas : config.cantidad_preguntas;
      const switchDificultad = modo === 'SALTO' ? config.jump_dificultad_min : config.dificultad_min;

      // Intento 1: Por Nodo y Dificultad
      const fallbackNodo = await db.execute({
        sql: `SELECT p.id_pregunta FROM pregunta p 
              JOIN ejercicio_pregunta ep ON ep.id_pregunta = p.id_pregunta 
              JOIN actividad a ON a.id_actividad = ep.id_actividad 
              WHERE a.id_nodo = ? AND p.nivel_dificultad >= ? 
              ORDER BY RANDOM() LIMIT ?`,
        args: [id_nodo, switchDificultad, switchCantidad],
      });
      preguntasIds = (fallbackNodo.rows || []).map((r: any) => r.id_pregunta);

      // Intento 2: Por Tópico general
      if (preguntasIds.length === 0 && config.topico) {
        const fallbackTopico = await db.execute({
          sql: `SELECT id_pregunta FROM pregunta WHERE topico = ? AND nivel_dificultad >= ? ORDER BY RANDOM() LIMIT ?`,
          args: [config.topico, switchDificultad, switchCantidad],
        });
        preguntasIds = (fallbackTopico.rows || []).map((r: any) => r.id_pregunta);
      }
    }
  }

  // 6. VALIDACIÓN FINAL Y CREACIÓN
  if (!preguntasIds || preguntasIds.length === 0) {
    throw new Error('No se pudieron encontrar preguntas válidas para generar este ejercicio.');
  }

  const id_intento = uuid();
  const detalle_inicial = JSON.stringify({ 
    modo, 
    preguntas: preguntasIds.map(id => ({ id_pregunta: id, respuesta_usuario: null, es_correcta: null })) 
  });

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
    const parsed = JSON.parse(String(intento.detalle_respuestas));
    if (parsed.modo) {
      modo = parsed.modo;
      detalle = parsed.preguntas || [];
    } else {
      // Compatibilidad con formato antiguo
      detalle = Array.isArray(parsed) ? parsed : [];
    }
  }
  
  const ids: string[] = detalle
    .map((d: any) => String(d.id_pregunta)) // Convertimos a String explícitamente
    .filter(Boolean);
  if (ids.length === 0) return { id_intento: intento.id_intento, preguntas: [], modo };

  const placeholders = ids.map(() => '?').join(',');
  const result = await db.execute({
    sql: `SELECT id_pregunta, enunciado, tipo_pregunta, nivel_dificultad, opciones, topico, puntos, respuesta_correcta FROM pregunta WHERE id_pregunta IN (${placeholders})`,
    args: ids as any[],
  });

  const preguntasMap = new Map((result.rows || []).map((p: any) => [p.id_pregunta, p]));
  const preguntasOrdenadas = ids.map((i) => preguntasMap.get(i)).filter(Boolean);

  return { id_intento: intento.id_intento, preguntas: preguntasOrdenadas, modo };
}

export async function updateIntentoFinal(id_usuario: string, data: { id_actividad: string; puntaje_obtenido: number; detalle_respuestas: string }) {
  const current = await db.execute({ 
    sql: `SELECT id_intento FROM intento_actividad WHERE id_usuario = ? AND id_actividad = ? AND puntaje_obtenido IS NULL`, 
    args: [id_usuario, data.id_actividad] 
  });
  
  let id_intento: string;
  if (!current.rows || current.rows.length === 0) {
    id_intento = uuid();
    await db.execute({
      sql: `INSERT INTO intento_actividad (id_intento, id_usuario, id_actividad, detalle_respuestas, puntaje_obtenido, fecha_hora) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      args: [id_intento, id_usuario, data.id_actividad, data.detalle_respuestas, data.puntaje_obtenido]
    });
  } else {
    id_intento = current.rows[0].id_intento as string;
    await db.execute({ 
      sql: `UPDATE intento_actividad SET puntaje_obtenido = ?, detalle_respuestas = ?, fecha_hora = CURRENT_TIMESTAMP WHERE id_intento = ?`, 
      args: [data.puntaje_obtenido, data.detalle_respuestas, id_intento] 
    });
  }

  let awardedCoins = 0;
  try {
    const actividadRes = await db.execute({ sql: `SELECT tipo_actividad, puntos_otorgados FROM actividad WHERE id_actividad = ?`, args: [data.id_actividad] });
    const tipoActividad = actividadRes.rows[0]?.tipo_actividad;
    const puntosOtorgados = Number(actividadRes.rows[0]?.puntos_otorgados || 0);
    
    let debeActualizar = false;
    if (tipoActividad === 'minijuego') {
      debeActualizar = data.puntaje_obtenido !== null && Number(data.puntaje_obtenido) >= 0;
    } else {
      const ejercicioRes = await db.execute({ sql: `SELECT minimo_aprobatorio FROM ejercicio WHERE id_actividad = ?`, args: [data.id_actividad] });
      const minimo = Number(ejercicioRes.rows[0]?.minimo_aprobatorio || 0);
      debeActualizar = Number(data.puntaje_obtenido) >= minimo;
    }

    if (debeActualizar) {
      const prev = await db.execute({ sql: `SELECT estado FROM progreso_actividad WHERE id_usuario = ? AND id_actividad = ?`, args: [id_usuario, data.id_actividad] });
      const prevEstado = prev.rows[0]?.estado;

      if (!prev.rows || prev.rows.length === 0) {
        await db.execute({ 
          sql: `INSERT INTO progreso_actividad (id_progreso, id_usuario, id_actividad, estado, mejor_puntaje, fecha_actualizacion) VALUES (?, ?, ?, 'completada', ?, CURRENT_TIMESTAMP)`, 
          args: [uuid(), id_usuario, data.id_actividad, data.puntaje_obtenido] 
        });
      } else {
        await db.execute({ 
          sql: `UPDATE progreso_actividad SET estado = 'completada', mejor_puntaje = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_usuario = ? AND id_actividad = ?`, 
          args: [data.puntaje_obtenido, id_usuario, data.id_actividad] 
        });
      }

      if (prevEstado !== 'completada' && puntosOtorgados > 0) {
        await db.execute({ sql: `UPDATE usuarios SET monedas_virtuales = COALESCE(monedas_virtuales,0) + ? WHERE id = ?`, args: [puntosOtorgados, id_usuario] });
        awardedCoins = puntosOtorgados;
      }
    }
  } catch (e) {
    console.error('Error en progreso:', e);
  }

  const updated = await db.execute({ sql: `SELECT monedas_virtuales FROM usuarios WHERE id = ?`, args: [id_usuario] });
  return { id_intento, awardedCoins, monedas_restantes: updated.rows[0]?.monedas_virtuales };
}

export async function completeLectura(id_usuario: string, id_actividad: string) {
  const actividadRes = await db.execute({ sql: `SELECT puntos_otorgados FROM actividad WHERE id_actividad = ?`, args: [id_actividad] });
  const puntosOtorgados = Number(actividadRes.rows[0]?.puntos_otorgados || 0);

  const prev = await db.execute({ sql: `SELECT estado FROM progreso_actividad WHERE id_usuario = ? AND id_actividad = ?`, args: [id_usuario, id_actividad] });
  const prevEstado = prev.rows[0]?.estado;

  if (!prev.rows || prev.rows.length === 0) {
    await db.execute({ 
      sql: `INSERT INTO progreso_actividad (id_progreso, id_usuario, id_actividad, estado, fecha_actualizacion) VALUES (?, ?, ?, 'completada', CURRENT_TIMESTAMP)`, 
      args: [uuid(), id_usuario, id_actividad] 
    });
  } else {
    await db.execute({ 
      sql: `UPDATE progreso_actividad SET estado = 'completada', fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_usuario = ? AND id_actividad = ?`, 
      args: [id_usuario, id_actividad] 
    });
  }

  let awardedCoins = 0;
  if (prevEstado !== 'completada' && puntosOtorgados > 0) {
    await db.execute({ sql: `UPDATE usuarios SET monedas_virtuales = COALESCE(monedas_virtuales,0) + ? WHERE id = ?`, args: [puntosOtorgados, id_usuario] });
    awardedCoins = puntosOtorgados;
  }

  const updated = await db.execute({ sql: `SELECT monedas_virtuales FROM usuarios WHERE id = ?`, args: [id_usuario] });
  return { awardedCoins, monedas_restantes: updated.rows[0]?.monedas_virtuales };
}

