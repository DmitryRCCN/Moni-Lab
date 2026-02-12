-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT DEFAULT 'estudiante',
  activo BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de refresh tokens para renovación de acceso
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  revoked BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de lecciones/módulos
CREATE TABLE IF NOT EXISTS lecciones (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  contenido TEXT,
  dificultad TEXT DEFAULT 'basico', -- basico, intermedio, avanzado
  orden INTEGER NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de progreso del usuario (qué lecciones ha completado)
CREATE TABLE IF NOT EXISTS progreso (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  leccion_id TEXT NOT NULL,
  estado TEXT DEFAULT 'iniciado', -- iniciado, completado, fallido
  puntaje DECIMAL(5,2),
  intentos INTEGER DEFAULT 1,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (leccion_id) REFERENCES lecciones(id) ON DELETE CASCADE,
  UNIQUE(usuario_id, leccion_id)
);

-- Tabla de features para ML (datos que envían al servicio de ML)
CREATE TABLE IF NOT EXISTS features (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  leccion_id TEXT,
  tiempo_dedicado INTEGER, -- en segundos
  errores_cometidos INTEGER DEFAULT 0,
  respuestas_correctas INTEGER DEFAULT 0,
  patrones TEXT, -- JSON con patrones de comportamiento
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (leccion_id) REFERENCES lecciones(id) ON DELETE CASCADE
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_usuario_id ON refresh_tokens(usuario_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_progreso_usuario_id ON progreso(usuario_id);
CREATE INDEX IF NOT EXISTS idx_progreso_leccion_id ON progreso(leccion_id);
CREATE INDEX IF NOT EXISTS idx_features_usuario_id ON features(usuario_id);
CREATE INDEX IF NOT EXISTS idx_lecciones_orden ON lecciones(orden);
