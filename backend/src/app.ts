import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './modules/auth/auth.routes';
import usuarioRoutes from './modules/usuario/usuario.routes';
import leccionesRoutes from './modules/lecciones/leccion.routes';
import meRoutes from './routes/me.route';
import nodoRoutes from './modules/nodo/nodo.routes';
import actividadRoutes from './modules/actividad/actividad.routes';
import itemRoutes from './modules/item/item.routes';
import mailRoutes from './modules/mail/mail.routes';
import { initMailScheduler } from './modules/mail/scheduler';

const app = express();

initMailScheduler(); // Iniciar el scheduler para envíos de correo programados

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

// Rutas de correo
app.use('/mail', mailRoutes);

export default app;