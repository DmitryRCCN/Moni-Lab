import { Router } from 'express';
import { getItemsHandler, postPurchaseHandler , postEquipHandler } from './item.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

// GET / -> listar items
router.get('/', getItemsHandler);

// POST /:id/comprar -> comprar item (requiere auth)
router.post('/:id/comprar', authMiddleware, postPurchaseHandler);

// POST /:id/equipar -> equipar item (requiere auth)
router.post('/:id/equipar', authMiddleware, postEquipHandler);

export default router;
