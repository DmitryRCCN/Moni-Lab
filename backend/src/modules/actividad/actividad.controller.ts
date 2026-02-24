import { Request, Response } from 'express';
import { getActividadById, getPreguntasByEjercicio, createIntento } from './actividad.service';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

export async function getActividadHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const actividad = await getActividadById(id);
    res.json(actividad);
  } catch (err: any) {
    res.status(404).json({ error: err.message || 'Actividad no encontrada' });
  }
}

export async function getPreguntasHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const preguntas = await getPreguntasByEjercicio(id);
    res.json({ preguntas });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error al obtener preguntas' });
  }
}

export async function postIntentoHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Usuario no autenticado' });
    const body = req.body;
    if (!body || !body.id_actividad) {
      return res.status(400).json({ error: 'id_actividad es requerido' });
    }
    const intento = await createIntento({ id_usuario: req.user.userId, id_actividad: body.id_actividad, puntaje_obtenido: body.puntaje_obtenido, detalle_respuestas: body.detalle_respuestas });
    res.status(201).json(intento);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error al crear intento' });
  }
}
