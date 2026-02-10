import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import usuarioRoutes from './modules/usuario/usuario.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/usuario', usuarioRoutes);

export default router;
