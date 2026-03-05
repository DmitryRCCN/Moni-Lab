import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { db } from './db/client';
import { sendMail } from './config/mail';

import authRoutes from './modules/auth/auth.routes';
import usuarioRoutes from './modules/usuario/usuario.routes';
import leccionesRoutes from './modules/lecciones/leccion.routes';
import meRoutes from './routes/me.route';
import nodoRoutes from './modules/nodo/nodo.routes';
import actividadRoutes from './modules/actividad/actividad.routes';
import itemRoutes from './modules/item/item.routes';

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://monilab.com.mx',
  'https://www.monilab.com.mx',
  'http://localhost:5173'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('Blocked by CORS:', origin);
      return callback(new Error('No permitido por CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de API protegidas
app.use('/api', meRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/lecciones', leccionesRoutes);
// Rutas nuevas para nodos (solo lectura) y actividad (GET)
app.use('/nodos', nodoRoutes);
app.use('/', actividadRoutes);
// Rutas de tienda
app.use('/items', itemRoutes);

/*
--- Rutas de prueba de aquí para abajo (ADVERTENCIA) ---
*/

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


// Ruta de prueba de correo SOLO en entornos no productivos
if (process.env.NODE_ENV !== 'production') {
  app.get('/test-email', async (_req, res) => {
    try {
      await sendMail(
        process.env.DEV_TEST_EMAIL || 'test@example.com',
        'Prueba Moni-Lab 🚀',
        '<h1>Funciona el sistema de correos 🎉</h1><p>Este es un test.</p>'
      );

      res.json({ message: 'Correo enviado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error enviando correo' });
    }
  });
}

export default app;
