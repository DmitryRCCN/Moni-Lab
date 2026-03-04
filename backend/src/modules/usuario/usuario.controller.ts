import { Request, Response } from 'express';
import { updateUserSchema } from './usuario.schema';
import {
  getUserProfile,
  updateUser,
  deleteUser,
  getUserProgress,
} from './usuario.service';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

/**
 * GET /usuario/me
 * Obtiene el perfil del usuario autenticado con estadísticas
 */
export async function getProfile(req: AuthRequest, res: Response) {
  try {
    console.log(res.locals.user); // Verificar que el usuario está presente
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const userProfile = await getUserProfile(req.user.userId);
    res.json(userProfile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * PUT /usuario/:id
 * Actualiza datos del usuario
 */
export async function update(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Solo pueden actualizar su propio perfil
    if (String(req.params.id) !== req.user.userId) {
      return res.status(403).json({ error: 'No tienes permisos para actualizar este usuario' });
    }

    const data = updateUserSchema.parse(req.body);
    const updatedUser = await updateUser(req.user.userId, data);
    res.json(updatedUser);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validación fallida', details: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * DELETE /usuario/:id
 * Desactiva la cuenta del usuario
 */
export async function deleteAccount(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Solo pueden borrar su propia cuenta
    if (String(req.params.id) !== req.user.userId) {
      return res.status(403).json({ error: 'No tienes permisos para borrar esta cuenta' });
    }

    const result = await deleteUser(req.user.userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /usuario/:id/progreso
 * Obtiene el historial de progreso del usuario
 */
export async function getProgress(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Solo pueden ver su propio progreso
    if (String(req.params.id) !== req.user.userId) {
      return res.status(403).json({ error: 'No tienes permisos para ver este progreso' });
    }

    const progress = await getUserProgress(req.user.userId);
    res.json({
      usuario_id: req.user.userId,
      progreso: progress.progreso || [],
      intentos: progress.intentos || [],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
