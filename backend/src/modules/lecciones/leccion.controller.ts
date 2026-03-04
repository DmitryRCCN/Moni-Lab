import { Request, Response } from 'express';
import { createLeccionSchema, updateLeccionSchema, getLeccionSchema } from './leccion.schema';
import {
  getAllLecciones,
  getLeccionContenido,
  createLeccion,
  updateLeccion,
  deleteLeccion,
  getLeccionStats,
} from './leccion.service';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

/**
 * GET /lecciones
 * Obtiene la lista de todas las lecciones
 */
export async function listLecciones(req: Request, res: Response) {
  try {
    const lecciones = await getAllLecciones();
    res.json({
      total: lecciones.length,
      lecciones,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /lecciones/:id
 * Obtiene una lección específica con su contenido
 */
export async function getLeccion(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const leccionId = Array.isArray(id) ? String(id[0]) : String(id);
    const leccion = await getLeccionContenido(leccionId);
    res.json(leccion);
  } catch (error: any) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /lecciones
 * Crea una nueva lección (solo admin)
 */
export async function createNewLeccion(req: AuthRequest, res: Response) {
  try {
    // Validar que sea admin (implementar verificación de rol)
    if (req.user && (req as any).user?.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear lecciones' });
    }

    const data = createLeccionSchema.parse(req.body);
    const newLeccion = await createLeccion(data);
    res.status(201).json(newLeccion);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validación fallida', details: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * PUT /lecciones/:id
 * Actualiza una lección (solo admin)
 */
export async function updateLeccionHandler(req: AuthRequest, res: Response) {
  try {
    // Validar que sea admin
    if (req.user && (req as any).user?.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden actualizar lecciones' });
    }

    const { id } = req.params;
    const leccionId = Array.isArray(id) ? String(id[0]) : String(id);
    const data = updateLeccionSchema.parse(req.body);
    const updatedLeccion = await updateLeccion(leccionId, data);
    res.json(updatedLeccion);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validación fallida', details: error.errors });
    }
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * DELETE /lecciones/:id
 * Desactiva una lección (solo admin)
 */
export async function deleteLeccionHandler(req: AuthRequest, res: Response) {
  try {
    // Validar que sea admin
    if (req.user && (req as any).user?.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden eliminar lecciones' });
    }

    const { id } = req.params;
    const leccionId = Array.isArray(id) ? String(id[0]) : String(id);
    const result = await deleteLeccion(leccionId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /lecciones/:id/stats
 * Obtiene estadísticas de una lección (solo admin)
 */
export async function getLeccionStatsHandler(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const leccionId = Array.isArray(id) ? String(id[0]) : String(id);
    const stats = await getLeccionStats(leccionId);
    res.json({
      leccion_id: leccionId,
      ...stats,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
