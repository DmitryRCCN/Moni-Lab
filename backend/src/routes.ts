import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import usuarioRoutes from './modules/usuario/usuario.routes';
import nodoRoutes from './modules/nodo/nodo.routes';
import actividadRoutes from './modules/actividad/actividad.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/usuario', usuarioRoutes);
router.use('/nodos', nodoRoutes);
router.use('/', actividadRoutes);

export default router;
