import { Router } from 'express';
import { getActividadHandler, getPreguntasHandler, postIntentoHandler } from './actividad.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/actividad/:id', getActividadHandler);
router.get('/ejercicio/:id/preguntas', getPreguntasHandler);
router.post('/intento', authMiddleware, postIntentoHandler);
router.post('/Lectura/completar', authMiddleware, );

export default router;
