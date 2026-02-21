import { Router } from 'express';
import { listNodos, createNodoHandler } from './nodo.controller';

const router = Router();

router.get('/', listNodos);

export default router;
