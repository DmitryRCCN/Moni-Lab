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
