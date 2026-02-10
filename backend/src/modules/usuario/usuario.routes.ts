import { Router } from 'express';
import { getUsuario } from './usuario.controller';

const router = Router();
router.get('/:id', getUsuario);
export default router;
