import { db } from '../../db/client';
import { v4 as uuid } from 'uuid';

export async function getAllNodos() {
  // Obtener nodos y sus actividades en una sola consulta y agrupar
  const result = await db.execute({
    sql: `
      SELECT n.id_nodo, n.titulo, n.descripcion, n.orden_secuencial as nodo_orden, n.topico,
             a.id_actividad, a.tipo_actividad, a.orden_secuencial as actividad_orden
      FROM nodo n
      LEFT JOIN actividad a ON a.id_nodo = n.id_nodo
      ORDER BY n.orden_secuencial ASC, a.orden_secuencial ASC
    `,
  });

  const rows = result.rows || [];
  const map: Record<string, any> = {};
  for (const r of rows) {
    const key = String(r.id_nodo);
    if (!map[key]) {
      map[key] = {
        id_nodo: r.id_nodo,
        titulo: r.titulo,
        descripcion: r.descripcion,
        orden_secuencial: r.nodo_orden,
        topico: r.topico,
        activities: [],
      };
    }
    if (r.id_actividad) {
      map[key].activities.push({ id_actividad: r.id_actividad, tipo_actividad: r.tipo_actividad, orden_secuencial: r.actividad_orden });
    }
  }

  return Object.values(map);
}

export async function createNodo(data: { titulo: string; descripcion?: string; orden_secuencial: number; topico: string }) {
  const id = uuid();
  await db.execute({
    sql: `INSERT INTO nodo (id_nodo, titulo, descripcion, orden_secuencial, topico) VALUES (?, ?, ?, ?, ?)`,
    args: [id, data.titulo, data.descripcion || null, data.orden_secuencial, data.topico],
  });
  return { id_nodo: id, ...data };
}
