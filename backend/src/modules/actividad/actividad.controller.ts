import { Request, Response } from 'express';
import { getActividadById } from './actividad.service';

export async function getActividadHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const actividad = await getActividadById(id);
    res.json(actividad);
  } catch (err: any) {
    res.status(404).json({ error: err.message || 'Actividad no encontrada' });
  }
}

import { getPreguntasByEjercicio, createIntento } from './actividad.service';

export async function getPreguntasHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const preguntas = await getPreguntasByEjercicio(id);
    res.json({ preguntas });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error al obtener preguntas' });
  }
}

export async function postIntentoHandler(req: Request, res: Response) {
  try {
    const body = req.body;
    if (!body || !body.id_usuario || !body.id_actividad) {
      return res.status(400).json({ error: 'id_usuario e id_actividad son requeridos' });
    }
    const intento = await createIntento({ id_usuario: body.id_usuario, id_actividad: body.id_actividad, puntaje_obtenido: body.puntaje_obtenido, detalle_respuestas: body.detalle_respuestas });
    res.status(201).json(intento);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error al crear intento' });
  }
}
