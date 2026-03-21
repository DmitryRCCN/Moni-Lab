-- ===============================
-- USUARIOS
-- ===============================
CREATE TABLE IF NOT EXISTS usuarios(
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  nombre TEXT NOT NULL UNIQUE,
  rol TEXT CHECK (rol IN ('estudiante', 'tutor', 'admin')) DEFAULT 'estudiante',
  activo BOOLEAN DEFAULT true,
  experiencia_total INTEGER DEFAULT 0,
  monedas_virtuales INTEGER DEFAULT 0,
  nivel_actual TEXT DEFAULT '1',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- REFRESH TOKENS
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
-- ACTIVIDAD
-- ===============================
CREATE TABLE IF NOT EXISTS actividad (
  id_actividad TEXT PRIMARY KEY,
  id_nodo TEXT NOT NULL,
  tipo_actividad TEXT CHECK (tipo_actividad IN ('lectura', 'ejercicio', 'minijuego')) NOT NULL,
  puntos_otorgados INTEGER DEFAULT 0,
  es_aleatorio BOOLEAN DEFAULT false,
  orden_secuencial INTEGER NOT NULL,
  FOREIGN KEY (id_nodo) REFERENCES nodo(id_nodo)
);

-- ===============================
-- MINIJUEGO
-- ===============================
CREATE TABLE IF NOT EXISTS minijuego (
  id_actividad TEXT PRIMARY KEY,
  titulo_pantalla TEXT NOT NULL,
  historia_intro TEXT,
  config_json TEXT NOT NULL,
  retroalimentacion_json TEXT,
  FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE CASCADE
);

-- ===============================
-- LECTURA
-- ===============================
CREATE TABLE IF NOT EXISTS lectura (
  id_actividad TEXT PRIMARY KEY,
  cuerpo_texto TEXT NOT NULL,
  url_multimedia TEXT,
  FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE CASCADE
);

-- ===============================
-- EJERCICIO
-- ===============================
CREATE TABLE IF NOT EXISTS ejercicio (
  id_actividad TEXT PRIMARY KEY,
  nivel_dificultad INTEGER NOT NULL,
  minimo_aprobatorio INTEGER NOT NULL,
  es_de_salto BOOLEAN DEFAULT false,
  dificultad_min INTEGER DEFAULT 1,
  dificultad_max INTEGER DEFAULT 10,
  cantidad_preguntas INTEGER DEFAULT 5,
  jump_cantidad_preguntas INTEGER DEFAULT 15,
  jump_dificultad_min INTEGER DEFAULT 2,
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
-- EJERCICIO_PREGUNTA
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
-- PROGRESO_NODO
-- ===============================
CREATE TABLE IF NOT EXISTS progreso_nodo (
  id_progreso TEXT PRIMARY KEY,
  id_usuario TEXT NOT NULL,
  id_nodo TEXT NOT NULL,
  estado TEXT CHECK (estado IN ('bloqueada','disponible','completada')) NOT NULL,
  mejor_puntaje INTEGER,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_nodo) REFERENCES nodo(id_nodo)
);

-- ===============================
-- PROGRESO_ACTIVIDAD
-- ===============================
CREATE TABLE IF NOT EXISTS progreso_actividad (
  id_progreso TEXT PRIMARY KEY,
  id_usuario TEXT NOT NULL,
  id_actividad TEXT NOT NULL,
  estado TEXT CHECK (estado IN ('bloqueada','disponible','completada')) NOT NULL,
  mejor_puntaje INTEGER,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad),
  UNIQUE(id_usuario, id_actividad)
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
  precio INTEGER NOT NULL,
  svg_capa TEXT
);

-- ===============================
-- USUARIO_ITEM
-- ===============================
CREATE TABLE IF NOT EXISTS usuario_item (
  id_usuario TEXT NOT NULL,
  id_item TEXT NOT NULL,
  equipado BOOLEAN DEFAULT false,
  PRIMARY KEY (id_usuario, id_item),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_item) REFERENCES item(id_item)
);

-- ===============================
-- INIT USER PROGRESS
-- ===============================
CREATE TRIGGER IF NOT EXISTS init_user_progress
AFTER INSERT ON usuarios
BEGIN
  INSERT INTO progreso_actividad (id_progreso, id_usuario, id_actividad, estado)
  SELECT 
    lower(hex(randomblob(16))),
    NEW.id,
    a.id_actividad,
    CASE 
      WHEN n.orden_secuencial = 1 AND a.orden_secuencial = 1 
      THEN 'disponible'
      ELSE 'bloqueada'
    END
  FROM actividad a
  JOIN nodo n ON a.id_nodo = n.id_nodo;
END;

-- ===============================
-- INIT USER NODE PROGRESS
-- ===============================
CREATE TRIGGER IF NOT EXISTS init_user_node_progress
AFTER INSERT ON usuarios
BEGIN
  INSERT INTO progreso_nodo (id_progreso, id_usuario, id_nodo, estado)
  SELECT 
    lower(hex(randomblob(16))),
    NEW.id,
    n.id_nodo,
    CASE 
      WHEN n.orden_secuencial = 1 THEN 'disponible'
      ELSE 'bloqueada'
    END
  FROM nodo n;
END;

-- ===============================
-- INIT ACTIVITY PROGRESS
-- ===============================
CREATE TRIGGER IF NOT EXISTS init_activity_progress
AFTER INSERT ON actividad
BEGIN
  INSERT INTO progreso_actividad (id_progreso, id_usuario, id_actividad, estado)
  SELECT
    lower(hex(randomblob(16))),
    u.id,
    NEW.id_actividad,
    'bloqueada'
  FROM usuarios u;
END;

-- ===============================
-- UNLOCK NEXT ACTIVITY
-- ===============================
CREATE TRIGGER IF NOT EXISTS unlock_next_activity
AFTER UPDATE OF estado ON progreso_actividad
WHEN NEW.estado = 'completada'
BEGIN
  UPDATE progreso_actividad
  SET estado = 'disponible'
  WHERE id_usuario = NEW.id_usuario
  AND id_actividad = (
    SELECT a2.id_actividad
    FROM actividad a1
    JOIN actividad a2 
      ON a1.id_nodo = a2.id_nodo
      AND a2.orden_secuencial = a1.orden_secuencial + 1
    WHERE a1.id_actividad = NEW.id_actividad
  )
  AND estado = 'bloqueada';
END;

-- ===============================
-- COMPLETE NODE
-- ===============================
CREATE TRIGGER IF NOT EXISTS complete_node_when_all_activities_done
AFTER UPDATE OF estado ON progreso_actividad
WHEN NEW.estado = 'completada'
AND NOT EXISTS (
    SELECT 1
    FROM actividad a
    JOIN progreso_actividad pa 
      ON pa.id_actividad = a.id_actividad
    WHERE a.id_nodo = (
        SELECT id_nodo 
        FROM actividad 
        WHERE id_actividad = NEW.id_actividad
    )
    AND pa.id_usuario = NEW.id_usuario
    AND pa.estado != 'completada'
)
BEGIN
  UPDATE progreso_nodo
  SET estado = 'completada'
  WHERE id_usuario = NEW.id_usuario
  AND id_nodo = (
    SELECT id_nodo 
    FROM actividad 
    WHERE id_actividad = NEW.id_actividad
  );
END;

-- ===============================
-- UNLOCK NEXT NODE
-- ===============================
CREATE TRIGGER IF NOT EXISTS unlock_next_node_when_completed
AFTER UPDATE OF estado ON progreso_nodo
WHEN NEW.estado = 'completada'
BEGIN
  UPDATE progreso_nodo
  SET estado = 'disponible'
  WHERE id_usuario = NEW.id_usuario
  AND id_nodo = (
    SELECT n2.id_nodo
    FROM nodo n1
    JOIN nodo n2 
      ON n2.orden_secuencial = n1.orden_secuencial + 1
    WHERE n1.id_nodo = NEW.id_nodo
  )
  AND estado = 'bloqueada';

  UPDATE progreso_actividad
  SET estado = 'disponible'
  WHERE id_usuario = NEW.id_usuario
  AND id_actividad = (
    SELECT a.id_actividad
    FROM nodo n1
    JOIN nodo n2 
      ON n2.orden_secuencial = n1.orden_secuencial + 1
    JOIN actividad a 
      ON a.id_nodo = n2.id_nodo
      AND a.orden_secuencial = 1
    WHERE n1.id_nodo = NEW.id_nodo
  )
  AND estado = 'bloqueada';
END; 
-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_usuario_id ON refresh_tokens(usuario_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_progreso_usuario_id ON progreso(usuario_id);
CREATE INDEX IF NOT EXISTS idx_progreso_leccion_id ON progreso(leccion_id);
CREATE INDEX IF NOT EXISTS idx_features_usuario_id ON features(usuario_id);
CREATE INDEX IF NOT EXISTS idx_lecciones_orden ON lecciones(orden);
