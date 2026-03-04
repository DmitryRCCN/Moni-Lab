# 🏗️ Arquitectura de Módulos - Moni-Lab Backend

## 📐 Estructura General

```
backend/
├── src/
│   ├── app.ts                    # Configuración de Express
│   ├── server.ts                 # Punto de entrada
│   ├── routes.ts                 # Router principal
│   │
│   ├── config/                   # Configuración
│   │   ├── env.ts               # Variables de entorno
│   │   ├── database.ts          # Pool de conexión
│   │   ├── constants.ts         # Constantes
│   │   └── mail.ts              # Configuración de email
│   │
│   ├── db/                       # Base de datos
│   │   ├── client.ts            # Cliente de Turso
│   │   └── turso.ts             # Instancia de Turso
│   │
│   ├── modules/                  # Módulos de la aplicación
│   │   ├── auth/                # 🔐 Autenticación
│   │   │   ├── auth.schema.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.middleware.ts (deprecado)
│   │   │
│   │   ├── usuario/             # 👤 Gestión de usuarios
│   │   │   ├── usuario.schema.ts
│   │   │   ├── usuario.service.ts
│   │   │   ├── usuario.controller.ts
│   │   │   └── usuario.routes.ts
│   │   │
│   │   ├── lecciones/           # 📚 Lecciones
│   │   │   ├── leccion.schema.ts
│   │   │   ├── leccion.service.ts
│   │   │   ├── leccion.controller.ts
│   │   │   └── leccion.routes.ts
│   │   │
│   │   ├── progreso/            # 📊 Progreso (PRÓXIMO)
│   │   │   ├── progreso.schema.ts
│   │   │   ├── progreso.service.ts
│   │   │   ├── progreso.controller.ts
│   │   │   └── progreso.routes.ts
│   │   │
│   │   └── recomendaciones/     # 🤖 ML (PRÓXIMO)
│   │       ├── recomendacion.schema.ts
│   │       ├── recomendacion.service.ts
│   │       ├── recomendacion.controller.ts
│   │       └── recomendacion.routes.ts
│   │
│   ├── routes/                   # Rutas especiales
│   │   └── me.route.ts          # GET /api/me (ruta pública)
│   │
│   ├── shared/                   # Código compartido
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts      # ✅ JWT validation
│   │   │   ├── error.middleware.ts     # ⚠️ Error handling
│   │   │   └── role.middleware.ts      # 👑 Autorización (PRÓXIMO)
│   │   │
│   │   ├── mail/
│   │   │   ├── mail.service.ts        # Envío de emails
│   │   │   └── templates/
│   │   │       ├── bienvenida.html
│   │   │       └── progreso.html
│   │   │
│   │   └── utils/
│   │       ├── jwt.ts                  # ✅ JWT signing/verification
│   │       ├── hash.ts                 # Password hashing
│   │       ├── fisherYates.ts         # Algoritmo de mezcla
│   │       └── random.ts               # Generación de aleatorios
│   │
│   └── utils/
│       └── jwt.ts (duplicado, usar shared/utils/jwt.ts)
│
├── schemas/
│   └── schema.sql               # ✅ Esquema completo de BD
│
├── .env                         # ✅ Variables de entorno
├── package.json                 # ✅ Dependencias
├── tsconfig.json               # ✅ Configuración TypeScript
└── jest.config.js              # Configuración de tests
```

---

## 🔄 Flujo de Datos - Exemplo Módulo Usuario

```
Cliente (Frontend)
       ↓
   Petición HTTP (GET /usuario/me + Token)
       ↓
Express Router (usuario.routes.ts)
   - Valida que use authMiddleware
   - Llama a usuarioController.getProfile()
       ↓
Controller (usuario.controller.ts)
   - Extrae userId del token (req.user.userId)
   - Valida la entrada si es necesario
   - Llama a usuarioService.getUserProfile(userId)
   - Envuelve resultado y lo retorna
       ↓
Service (usuario.service.ts)
   - Ejecuta queries a la BD
   - Aplica lógica de negocio
   - Calcula estadísticas
       ↓
Database Queries
   - SELECT * FROM usuarios WHERE id = ?
   - SELECT COUNT(*), AVG(puntaje) FROM progreso WHERE usuario_id = ?
       ↓
BD Turso
   - Obtiene datos
       ↓
Service retorna resultado
       ↓
Controller formatea respuesta JSON
       ↓
Cliente recibe:
{
  "id": "uuid",
  "email": "diego@example.com",
  "nombre": "Diego",
  "estadisticas": {
    "leccionesCompletadas": 7,
    "puntajePromedio": 85.5
  }
}
```

---

## 📋 Checklist para Crear un Nuevo Módulo

Cuando agregues un nuevo módulo, sigue estos pasos:

### 1. Crear Estructura de Carpetas
```bash
mkdir -p backend/src/modules/mi_modulo
```

### 2. Crear Archivo Schema (validaciones)
**Archivo:** `mi_modulo.schema.ts`
```typescript
import { z } from 'zod';

export const createMiRecursoSchema = z.object({
  nombre: z.string().min(3),
  descripcion: z.string().optional(),
  // ... más campos
});
```

### 3. Crear Archivo Service (lógica)
**Archivo:** `mi_modulo.service.ts`
```typescript
import { db } from '../../db/client';

export async function getMiRecurso(id: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM mi_tabla WHERE id = ?',
    args: [id],
  });
  if (result.rows.length === 0) throw new Error('No encontrado');
  return result.rows[0];
}

export async function createMiRecurso(data: CreateData) {
  const id = uuid();
  await db.execute({
    sql: 'INSERT INTO mi_tabla (id, ...) VALUES (?, ...)',
    args: [id, ...],
  });
  return getMiRecurso(id);
}
```

### 4. Crear Archivo Controller (HTTP)
**Archivo:** `mi_modulo.controller.ts`
```typescript
import { Request, Response } from 'express';
import { createMiRecursoSchema } from './mi_modulo.schema';
import { createMiRecurso } from './mi_modulo.service';

export async function create(req: Request, res: Response) {
  try {
    const data = createMiRecursoSchema.parse(req.body);
    const result = await createMiRecurso(data);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validación fallida', 
        details: error.errors 
      });
    }
    res.status(500).json({ error: error.message });
  }
}
```

### 5. Crear Archivo Routes (endpoints)
**Archivo:** `mi_modulo.routes.ts`
```typescript
import { Router } from 'express';
import { create, getById, update, delete: deleteRecurso } from './mi_modulo.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Rutas públicas
router.get('/', getAll);

// Rutas protegidas
router.use(authMiddleware);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteRecurso);

export default router;
```

### 6. Registrar Rutas en app.ts
```typescript
import miModuloRoutes from './modules/mi_modulo/mi_modulo.routes';

// En app.ts
app.use('/mi-modulo', miModuloRoutes);
```

### 7. Crear Tabla en schema.sql
```sql
CREATE TABLE IF NOT EXISTS mi_tabla (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  usuario_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_mi_tabla_usuario_id ON mi_tabla(usuario_id);
```

---

## 🚀 Módulos por Implementar (Orden Sugerido)

### Fase 1: ✅ Completado
- [x] Autenticación (register, login, refresh, logout)
- [x] Gestión de Usuarios (perfil, estadísticas)
- [x] Lecciones (CRUD, listar)

### Fase 2: 🔄 En Progreso
- [ ] **Progreso** (más importante)
  - POST /progreso - Registrar que el usuario intentó una lección
  - GET /progreso - Ver historial
  - PUT /progreso/:id - Actualizar resultado
  - Campos: usuario_id, leccion_id, estado, puntaje, intentos

### Fase 3: 🚧 Próximas
- [ ] **Middleware de Roles**
  - Verificar `rol` en JWT
  - roleMiddleware(requiredRole: string)
  - Proteger endpoints admin

- [ ] **Recomendaciones (ML Integration)**
  - POST /recomendaciones/analizar
  - GET /recomendaciones
  - Consume servicio ML

- [ ] **Rate Limiting**
  - express-rate-limit
  - 5 intentos de login por IP
  - 100 requests por minuto por usuario

---

## 🔒 Patrón de Seguridad

```typescript
// MALO ❌
export async function updateUser(req: Request, res: Response) {
  const user = await getUserById(req.body.userId); // No validado
  user.rol = 'admin'; // ¡Privilege escalation!
  await saveUser(user);
}

// BUENO ✅
export async function updateUser(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'No auth' });
  
  // Solo actualizar su propio usuario
  if (req.params.id !== req.user.userId) {
    return res.status(403).json({ error: 'No permissions' });
  }
  
  // Validar campos permitidos
  const data = updateUserSchema.parse(req.body); // No incluye 'rol'
  await updateUser(req.user.userId, data);
}
```

---

## 📊 Envío de Datos al Servicio ML

```typescript
// En progreso.controller.ts
export async function registrarProgreso(req: AuthRequest, res: Response) {
  // ...
  const progreso = await createProgreso({
    usuario_id: req.user.userId,
    leccion_id: req.body.leccion_id,
    puntaje: req.body.puntaje,
    // ...
  });
  
  // Enviar a ML para análisis
  try {
    await axios.post('http://ml-service:8000/analizar', {
      usuario_id: req.user.userId,
      features: {
        tiempo_dedicado: req.body.tiempo,
        errores: req.body.errores,
        // ...
      }
    });
  } catch (error) {
    console.error('ML service error:', error);
    // No bloquear si ML falla
  }
  
  res.json(progreso);
}
```

---

## 🧪 Testing

Cada módulo debe tener tests:

```typescript
// usuario.test.ts
describe('Usuario', () => {
  test('getUserProfile retorna estadísticas', async () => {
    const profile = await getUserProfile(userId);
    expect(profile.estadisticas).toBeDefined();
    expect(profile.estadisticas.leccionesCompletadas).toBeGreaterThanOrEqual(0);
  });
  
  test('updateUser solo actualiza campos permitidos', async () => {
    await updateUser(userId, { nombre: 'Nuevo Nombre', rol: 'admin' });
    const user = await getUserById(userId);
    expect(user.nombre).toBe('Nuevo Nombre');
    expect(user.rol).not.toBe('admin'); // No debería cambiar
  });
});
```

Ejecutar tests:
```bash
npm run test          # Ejecutar todos
npm run test -- usuario  # Un test específico
```

---

## 📚 Referencias Rápidas

### Importar módulo
```typescript
import { funcionName } from '../modules/mi_modulo/mi_modulo.service';
```

### Usar authMiddleware
```typescript
router.use(authMiddleware); // Protege todas las rutas
// O una por una:
router.get('/privado', authMiddleware, handler);
```

### Queries a la BD
```typescript
const result = await db.execute({
  sql: 'SELECT * FROM usuarios WHERE id = ? AND activo = true',
  args: [userId],
});

// Acceder a resultados
if (result.rows.length === 0) throw new Error('No encontrado');
const user = result.rows[0];
```

### Validar con Zod
```typescript
try {
  const data = miSchema.parse(req.body);
  // data está tipado y validado
} catch (error: any) {
  if (error.name === 'ZodError') {
    return res.status(400).json({ 
      error: error.errors 
    });
  }
}
```
