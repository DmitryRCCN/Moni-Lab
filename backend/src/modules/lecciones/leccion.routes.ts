import { Router } from 'express';
import {
  listLecciones,
  getLeccion,
  createNewLeccion,
  updateLeccionHandler,
  deleteLeccionHandler,
  getLeccionStatsHandler,
} from './leccion.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

// GET /lecciones - Listar todas las lecciones (sin autenticación)
router.get('/', listLecciones);

// GET /lecciones/:id - Obtener una lección específica (requiere autenticación)
router.get('/:id', authMiddleware, getLeccion);

// POST /lecciones - Crear nueva lección (solo admin)
router.post('/', authMiddleware, createNewLeccion);

// PUT /lecciones/:id - Actualizar lección (solo admin)
router.put('/:id', authMiddleware, updateLeccionHandler);

// DELETE /lecciones/:id - Desactivar lección (solo admin)
router.delete('/:id', authMiddleware, deleteLeccionHandler);

// GET /lecciones/:id/stats - Estadísticas de la lección (solo admin)
router.get('/:id/stats', authMiddleware, getLeccionStatsHandler);

export default router;
