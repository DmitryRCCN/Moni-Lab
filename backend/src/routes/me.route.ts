import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../shared/middlewares/auth.middleware';
import { db } from '../db/client';

const router = Router();

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not found in request' });
    }

    const result = await db.execute({
      sql: 'SELECT id, email, nombre FROM usuarios WHERE id = ?',
      args: [req.user.userId],
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Token válido',
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;