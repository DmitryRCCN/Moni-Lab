import { Router } from 'express';
import { getActividadHandler, getPreguntasHandler, postIntentoHandler, postCompletarLecturaHandler } from './actividad.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/actividad/:id', getActividadHandler);
router.get('/ejercicio/:id/preguntas', getPreguntasHandler);
router.post('/intento', authMiddleware, postIntentoHandler);

// Ruta compatible con frontend: POST /actividad/completar-lectura
router.post('/actividad/completar-lectura', authMiddleware, postCompletarLecturaHandler);

export default router;
