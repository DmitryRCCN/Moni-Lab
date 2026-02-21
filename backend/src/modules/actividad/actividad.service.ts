import { db } from '../../db/client';

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
