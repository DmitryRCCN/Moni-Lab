import { Router } from 'express';
import { getProfile, update, deleteAccount, getProgress } from './usuario.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Todas las rutas de usuario requieren autenticación
router.use(authMiddleware);

// GET /usuario/me - Obtener perfil del usuario autenticado
router.get('/me', getProfile);

// PUT /usuario/:id - Actualizar datos del usuario
router.put('/:id', update);

// DELETE /usuario/:id - Desactivar cuenta
router.delete('/:id', deleteAccount);

// GET /usuario/:id/progreso - Obtener progreso del usuario
router.get('/:id/progreso', getProgress);

export default router;
