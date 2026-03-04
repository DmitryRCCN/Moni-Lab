import { Request, Response } from 'express';
import { getActividadById, getPreguntasByEjercicio, updateIntentoFinal, completeLectura } from './actividad.service';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

export async function getActividadHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const actividad = await getActividadById(id);
    res.json(actividad);
  } catch (err: any) {
    res.status(404).json({ error: err.message || 'Actividad no encontrada' });
  }
}

export async function getPreguntasHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'No auth' });
    const id = String(req.params.id);
    const data = await getPreguntasByEjercicio(id, String(req.user.userId));
    res.json(data);
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
    const idActividad = Array.isArray(body.id_actividad) ? String(body.id_actividad[0]) : String(body.id_actividad);
    const intento = await updateIntentoFinal(String(req.user.userId), { id_actividad: idActividad, puntaje_obtenido: Number(body.puntaje_obtenido ?? 0), detalle_respuestas: body.detalle_respuestas });
    res.status(201).json(intento);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error al crear intento' });
  }
}

export async function postCompletarLecturaHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Usuario no autenticado' });
    const body = req.body;
    const id_actividad_raw = body?.id_actividad || body?.id;
    const id_actividad = Array.isArray(id_actividad_raw) ? String(id_actividad_raw[0]) : String(id_actividad_raw);
    if (!id_actividad) return res.status(400).json({ error: 'id_actividad es requerido' });

    const result = await completeLectura(String(req.user.userId), id_actividad);
    res.status(200).json({ message: 'Lectura marcada como completada', ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error al completar lectura' });
  }
}

