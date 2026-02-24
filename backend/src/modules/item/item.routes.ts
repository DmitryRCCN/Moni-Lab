import { Router } from 'express';
import { getItemsHandler, postPurchaseHandler } from './item.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

// GET / -> listar items
router.get('/', getItemsHandler);

// POST /:id/comprar -> comprar item (requiere auth)
router.post('/:id/comprar', authMiddleware, postPurchaseHandler);

export default router;
