-- ===============================
-- USUARIOS (Entidad central)
-- ===============================
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nombre TEXT NOT NULL,

  rol TEXT CHECK (rol IN ('estudiante', 'tutor', 'admin')) DEFAULT 'estudiante',
  activo BOOLEAN DEFAULT true,

  experiencia_total INTEGER DEFAULT 0,
  monedas_virtuales INTEGER DEFAULT 0,
  nivel_actual TEXT DEFAULT '0.0',

  id_tutor TEXT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

  -- ===============================
  -- REFRESH TOKENS (JWT)
  -- ===============================
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

  -- ===============================
  -- TUTOR
  -- ===============================
  CREATE TABLE IF NOT EXISTS tutor (
    id_tutor TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    rol TEXT CHECK (rol IN ('padre', 'docente')) NOT NULL,
    estado_cuenta TEXT DEFAULT 'activa'
  );

  -- ===============================
  -- ADMIN
  -- ===============================
  CREATE TABLE IF NOT EXISTS admin (
    id_admin TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nivel_acceso INTEGER NOT NULL
  );

  -- ===============================
  -- NODO
  -- ===============================
  CREATE TABLE IF NOT EXISTS nodo (
    id_nodo TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    orden_secuencial INTEGER NOT NULL,
    topico TEXT NOT NULL
  );

  -- ===============================
  -- ACTIVIDAD (Entidad padre)
  -- ===============================
  CREATE TABLE IF NOT EXISTS actividad (
    id_actividad TEXT PRIMARY KEY,
    id_nodo TEXT NOT NULL,
    orden_secuencial INTEGER NOT NULL,
    tipo_actividad TEXT CHECK (tipo_actividad IN ('lectura', 'ejercicio')) NOT NULL,
    puntos_otorgados INTEGER DEFAULT 0,
    es_aleatorio BOOLEAN DEFAULT false,
    FOREIGN KEY (id_nodo) REFERENCES nodo(id_nodo)
  );

  -- ===============================
  -- LECTURA (Especialización)
  -- ===============================
  CREATE TABLE IF NOT EXISTS lectura (
    id_actividad TEXT PRIMARY KEY,
    cuerpo_texto TEXT NOT NULL,
    url_multimedia TEXT,
    FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE CASCADE
  );

  -- ===============================
  -- EJERCICIO (Especialización)
  -- ===============================
  CREATE TABLE IF NOT EXISTS ejercicio (
    id_actividad TEXT PRIMARY KEY,
    nivel_dificultad INTEGER NOT NULL,
    minimo_aprobatorio INTEGER NOT NULL,
    es_de_salto BOOLEAN DEFAULT false,
    FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE CASCADE
  );

  -- ===============================
  -- PREGUNTA
  -- ===============================
  CREATE TABLE IF NOT EXISTS pregunta (
    id_pregunta TEXT PRIMARY KEY,
    enunciado TEXT NOT NULL,
    tipo_pregunta TEXT NOT NULL,
    nivel_dificultad INTEGER NOT NULL,
    respuesta_correcta TEXT NOT NULL,
    opciones TEXT NOT NULL,
    topico TEXT NOT NULL,
    puntos INTEGER NOT NULL
  );

  -- ===============================
  -- EJERCICIO_PREGUNTA (N:M)
  -- ===============================
  CREATE TABLE IF NOT EXISTS ejercicio_pregunta (
    id_actividad TEXT NOT NULL,
    id_pregunta TEXT NOT NULL,
    PRIMARY KEY (id_actividad, id_pregunta),
    FOREIGN KEY (id_actividad) REFERENCES ejercicio(id_actividad) ON DELETE CASCADE,
    FOREIGN KEY (id_pregunta) REFERENCES pregunta(id_pregunta) ON DELETE CASCADE
  );

  -- ===============================
  -- INTENTO_ACTIVIDAD
  -- ===============================
  CREATE TABLE IF NOT EXISTS intento_actividad (
    id_intento TEXT PRIMARY KEY,
    id_usuario TEXT NOT NULL,
    id_actividad TEXT NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    puntaje_obtenido INTEGER,
    detalle_respuestas TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad)
  );

  -- ===============================
  -- PROGRESO_ACTIVIDAD
  -- ===============================
  CREATE TABLE IF NOT EXISTS progreso_actividad (
    id_progreso TEXT PRIMARY KEY,
    id_usuario TEXT NOT NULL,
    id_actividad TEXT NOT NULL,
    estado TEXT NOT NULL,
    mejor_puntaje INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad)
  );

  -- ===============================
  -- PROGRESO_NODO
  -- ===============================
  CREATE TABLE IF NOT EXISTS progreso_nodo (
    id_progreso TEXT PRIMARY KEY,
    id_usuario TEXT NOT NULL,
    id_nodo TEXT NOT NULL,
    estado TEXT NOT NULL,
    mejor_puntaje INTEGER,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_nodo) REFERENCES nodo(id_nodo)
  );

  -- ===============================
  -- AVATAR
  -- ===============================
  CREATE TABLE IF NOT EXISTS avatar (
    id_avatar TEXT PRIMARY KEY,
    id_usuario TEXT UNIQUE NOT NULL,
    color_piel TEXT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  -- ===============================
  -- ITEM
  -- ===============================
  CREATE TABLE IF NOT EXISTS item (
    id_item TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL,
    precio INTEGER NOT NULL
  );

  -- ===============================
  -- USUARIO_ITEM (Inventario / Compras)
  -- ===============================
  CREATE TABLE IF NOT EXISTS usuario_item (
    id_usuario TEXT NOT NULL,
    id_item TEXT NOT NULL,
    equipado BOOLEAN DEFAULT false,
    PRIMARY KEY (id_usuario, id_item),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_item) REFERENCES item(id_item)
  );


-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_usuario_id ON refresh_tokens(usuario_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_progreso_usuario_id ON progreso(usuario_id);
CREATE INDEX IF NOT EXISTS idx_progreso_leccion_id ON progreso(leccion_id);
CREATE INDEX IF NOT EXISTS idx_features_usuario_id ON features(usuario_id);
CREATE INDEX IF NOT EXISTS idx_lecciones_orden ON lecciones(orden);
