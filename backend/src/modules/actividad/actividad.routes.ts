import { Router } from 'express';
import { getActividadHandler } from './actividad.controller';

const router = Router();

router.get('/actividad/:id', getActividadHandler);

import { getPreguntasHandler, postIntentoHandler } from './actividad.controller';

router.get('/ejercicio/:id/preguntas', getPreguntasHandler);
router.post('/intento', postIntentoHandler);

export default router;
