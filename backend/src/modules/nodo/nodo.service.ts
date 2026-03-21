import { db } from '../../db/client';
import { v4 as uuid } from 'uuid';

export async function getAllNodos() {
  // Obtener nodos
  const nodosResult = await db.execute({
    sql: `SELECT id_nodo, titulo, descripcion, orden_secuencial, topico FROM nodo ORDER BY orden_secuencial ASC`,
  });

  // Obtener actividades con información de ejercicio
  const actividadesResult = await db.execute({
    sql: `
      SELECT a.id_actividad, a.tipo_actividad, a.orden_secuencial as actividad_orden,
             e.es_de_salto
      FROM actividad a
      LEFT JOIN ejercicio e ON a.id_actividad = e.id_actividad
      ORDER BY a.orden_secuencial ASC
    `,
  });

  // Obtener id_nodo para cada actividad
  const actividadesIds = actividadesResult.rows?.map((a: any) => a.id_actividad) || [];
  let idNodosMap: Record<string, string> = {};

  if (actividadesIds.length > 0) {
    const placeholders = actividadesIds.map(() => '?').join(',');
    const idNodosResult = await db.execute({
      sql: `SELECT id_actividad, id_nodo FROM actividad WHERE id_actividad IN (${placeholders})`,
      args: actividadesIds,
    });

    idNodosMap = (idNodosResult.rows || []).reduce((map: Record<string, string>, row: any) => {
      map[row.id_actividad] = row.id_nodo;
      return map;
    }, {});
  }

  const actividades = actividadesResult.rows?.map((actividad: any) => ({
    id_actividad: actividad.id_actividad,
    tipo_actividad: actividad.tipo_actividad,
    orden_secuencial: actividad.actividad_orden,
    es_de_salto: !!actividad.es_de_salto,
    id_nodo: idNodosMap[actividad.id_actividad],
  })) || [];

  // Agrupar actividades por id_nodo
  const actividadesPorNodo: Record<string, any[]> = {};
  for (const actividad of actividades) {
    const id_nodo = actividad.id_nodo;
    if (id_nodo) {
      if (!actividadesPorNodo[id_nodo]) {
        actividadesPorNodo[id_nodo] = [];
      }
      actividadesPorNodo[id_nodo].push({
        id_actividad: actividad.id_actividad,
        tipo_actividad: actividad.tipo_actividad,
        orden_secuencial: actividad.orden_secuencial,
        es_de_salto: actividad.es_de_salto,
      });
    }
  }

  // Combinar nodos con sus actividades
  return (nodosResult.rows || []).map((nodo: any) => ({
    id_nodo: nodo.id_nodo,
    titulo: nodo.titulo,
    descripcion: nodo.descripcion,
    orden_secuencial: nodo.orden_secuencial,
    topico: nodo.topico,
    activities: actividadesPorNodo[nodo.id_nodo] || [],
  }));
}

export async function createNodo(data: { titulo: string; descripcion?: string; orden_secuencial: number; topico: string }) {
  const id = uuid();
  await db.execute({
    sql: `INSERT INTO nodo (id_nodo, titulo, descripcion, orden_secuencial, topico) VALUES (?, ?, ?, ?, ?)`,
    args: [id, data.titulo, data.descripcion || null, data.orden_secuencial, data.topico],
  });
  return { id_nodo: id, ...data };
}
