import { Router } from 'express';
import { getActividadHandler } from './actividad.controller';

const router = Router();

router.get('/actividad/:id', getActividadHandler);

export default router;
