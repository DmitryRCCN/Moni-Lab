import express from 'express';
import cookieParser from 'cookie-parser';
import { db } from './db/client';

import authRoutes from './modules/auth/auth.routes';
import usuarioRoutes from './modules/usuario/usuario.routes';
import leccionesRoutes from './modules/lecciones/leccion.routes';
import meRoutes from './routes/me.route';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de API protegidas
app.use('/api', meRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/lecciones', leccionesRoutes);

// Endpoint de prueba (sin autenticación)
app.get('/api/test', (_req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        'POST /auth/register': 'Registrar usuario',
        'POST /auth/login': 'Iniciar sesión',
        'POST /auth/refresh': 'Renovar access token',
        'POST /auth/logout': 'Cerrar sesión',
      },
      usuario: {
        'GET /usuario/me': 'Obtener perfil (requiere auth)',
        'PUT /usuario/:id': 'Actualizar perfil (requiere auth)',
        'DELETE /usuario/:id': 'Desactivar cuenta (requiere auth)',
        'GET /usuario/:id/progreso': 'Ver progreso (requiere auth)',
      },
      lecciones: {
        'GET /lecciones': 'Listar todas las lecciones',
        'GET /lecciones/:id': 'Obtener lección (requiere auth)',
        'POST /lecciones': 'Crear lección (solo admin)',
        'PUT /lecciones/:id': 'Actualizar lección (solo admin)',
        'DELETE /lecciones/:id': 'Desactivar lección (solo admin)',
      },
    }
  });
});

app.get('/health/db', async (_req, res) => {
  try {
    const result = await db.execute('SELECT 1 as ok');
    res.json({ status: 'ok', db: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'DB connection failed' });
  }
});


export default app;
