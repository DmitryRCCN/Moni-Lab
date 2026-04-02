# 📚 Moni-Lab: Documentación Completa del Proyecto

**Versión del Documento:** 1.0
**Última Actualización:** Abril 2026
**Estado:** Actualizado y en producción

---

## 📋 Tabla de Contenidos

1. [Introducción y Objetivos](#introducción-y-objetivos)
2. [Arquitectura General](#arquitectura-general)
3. [Componentes Principales](#componentes-principales)
4. [Tecnologías Utilizadas](#tecnologías-utilizadas)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Base de Datos](#base-de-datos)
7. [Backend API](#backend-api)
8. [Frontend](#frontend)
9. [ML Service](#ml-service)
10. [Sistema de Correos](#sistema-de-correos)
11. [Generación de PDFs](#generación-de-pdfs)
12. [Flujo de Datos](#flujo-de-datos)
13. [Deployment y Hosting](#deployment-y-hosting)
14. [Guías de Uso](#guías-de-uso)

---

## 🎯 Introducción y Objetivos

### ¿Qué es Moni-Lab?

**Moni-Lab** es una plataforma educativa gamificada diseñada para proporcionar una experiencia de aprendizaje adaptativa e interactiva. La plataforma integra tecnología de machine learning para análisis de desempeño estudiantil, permitiendo a tutores y administradores tomar decisiones basadas en datos.

### Objetivos Principales del Proyecto

1. **Gamificación del Aprendizaje**: Motiva a los estudiantes mediante un sistema de recompensas (XP, monedas virtuales, avatares personalizables)

2. **Aprendizaje Adaptativo**: Utiliza machine learning para ajustar la dificultad de ejercicios en base al desempeño del estudiante

3. **Progreso Transparente**: Sistema de nodos secuenciales que permite que estudiantes vean su avance de forma clara

4. **Análisis Inteligente**: Los tutores reciben reportes detallados sobre el desempeño de sus estudiantes con recomendaciones

5. **Accesibilidad**: Interfaz intuitiva con soporte para dispositivos móviles y de escritorio

6. **Escalabilidad**: Arquitectura modular que permite crecimiento tanto en usuarios como en contenido educativo

### Diferenciadores Clave

- **Sistema de Nodos y Actividades**: Estructura modular que permite crear caminos de aprendizaje personalizados
- **Minijuegos Educativos**: Actividades interactivas que hacen el aprendizaje más ameno
- **Cosmética Virtual**: Sistema de marketplace donde los estudiantes gastan sus monedas virtuales ganadas
- **Análisis ML**: K-Means clustering para identificar patrones de aprendizaje
- **Múltiples Tipos de Actividades**: Lecturas, ejercicios adaptativos, y minijuegos

---

## 🏗️ Arquitectura General

### Modelo Arquitectónico: Three-Tier

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Vercel)                      │
│                    React + Vite + TailwindCSS               │
└────────────────────────────┬────────────────────────────────┘
                             │ REST API
┌────────────────────────────▼────────────────────────────────┐
│                     BACKEND (Railway)                       │
│          Express.js + TypeScript + Turso                    │
│  (Authentication, Routing, Business Logic, Database Calls)  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP Requests
┌────────────────────────────▼────────────────────────────────┐
│                    ML SERVICE (Railway)                     │
│          FastAPI (Python) - K-Means Analysis, Reports       │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Alto Nivel

1. **Usuario** accede a la aplicación desde Vercel (Frontend)
2. **Frontend** realiza llamadas HTTP/REST al Backend (Railway)
3. **Backend** valida credenciales, consulta la base de datos Turso, y ejecuta lógica de negocio
4. **Backend** puede invocar al ML Service para análisis avanzados
5. **ML Service** procesa datos con K-Means clustering y genera reportes/PDFs
6. **Sistema de Correos** envía notificaciones a tutores y estudiantes

---

## 🔧 Componentes Principales

### 1. Frontend - Interfaz de Usuario
- **Localización**: Vercel (CDN global)
- **Tecnología**: React 19 + TypeScript + Vite
- **Estilos**: TailwindCSS 4
- **Gestión de Estado**: Zustand
- **Validación**: Zod
- **Enrutamiento**: React Router v7
- **Animaciones**: Framer Motion

**Responsabilidades:**
- Renderizar interfaz de usuario responsiva
- Gestionar autenticación del lado del cliente
- Comunicación con backend vía API REST
- Visualización de nodos, actividades, avatares y tienda

### 2. Backend - API y Lógica de Negocio
- **Localización**: Railway
- **Tecnología**: Express.js + TypeScript
- **Base de Datos**: Turso (SQLite distribuido)
- **Validación**: Zod schemas
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Correos**: Resend + React Email

**Responsabilidades:**
- Servir endpoints REST para todas las operaciones
- Validar y autorizar solicitudes
- Ejecutar lógica de negocio
- Gestionar progresos de usuarios
- Enviar correos y generar reportes
- Comunicarse con ML Service

### 3. ML Service - Análisis Avanzado
- **Localización**: Railway
- **Tecnología**: FastAPI (Python)
- **Análisis**: K-Means clustering
- **Reportes**: PDF generation con matplotlib
- **Correos**: Integración con Resend

**Responsabilidades:**
- Analizar datos de desempeño de estudiantes
- Generar gráficos de progreso
- Crear reportes en PDF para tutores
- Identificar estudiantes con bajo rendimiento
- Enviar reportes por correo

---

## 🛠️ Tecnologías Utilizadas

### Frontend Stack
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 19.2 | Framework de UI |
| TypeScript | 5.9 | Tipado estático |
| Vite | 7.3 | Bundler y dev server |
| TailwindCSS | 4.1 | Estilos utilitarios |
| Zustand | 5.0 | State management |
| React Router | 7.13 | Enrutamiento |
| Framer Motion | 12.36 | Animaciones |
| Zod | 4.3 | Validación de esquemas |
| Axios | 1.13 | HTTP client |
| Lucide React | 0.577 | Iconos |

### Backend Stack
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Express.js | 5.2 | Framework web |
| TypeScript | 5.9 | Tipado estático |
| Turso | 0.17 | Base de datos SQLite distribuida |
| JWT | 9.0 | Autenticación |
| Bcrypt | 6.0 | Hash de contraseñas |
| Zod | 4.3 | Validación de esquemas |
| Nodemailer | 8.0 | Servicio de correos |
| Resend | 6.9 | API de correos transaccionales |
| React Email | 1.0 | Templates de correos |
| Puppeteer | 24.39 | Generación de PDFs |
| Node-Cron | 4.2 | Tareas programadas |
| Helmet | 8.1 | Seguridad HTTP |
| CORS | 2.8 | Control de acceso cross-origin |
| Express Rate Limit | 8.2 | Limitación de tasa |

### ML Service Stack
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| FastAPI | Latest | Framework web |
| Python | 3.x | Lenguaje de programación |
| Scikit-learn | Latest | K-Means clustering |
| Pandas | Latest | Procesamiento de datos |
| Matplotlib | Latest | Visualización de gráficos |
| ReportLab | Latest | Generación de PDFs |

### Infraestructura
| Servicio | Propósito |
|---------|----------|
| Vercel | Hosting del Frontend |
| Railway | Hosting del Backend y ML Service |
| Turso | Base de datos distribuida |
| Resend | Servicio de correos transaccionales |

---

## 📁 Estructura del Proyecto

```
Moni-Lab/
├── frontend/                          # Aplicación React
│   ├── src/
│   │   ├── pages/                     # Páginas principales
│   │   │   ├── Home.tsx              # Landing page
│   │   │   ├── Login.tsx             # Autenticación
│   │   │   ├── Register.tsx          # Registro
│   │   │   ├── Path.tsx              # Mapa de nodos
│   │   │   ├── Lesson.tsx            # Reproductor de actividades
│   │   │   ├── Profile.tsx           # Perfil del usuario
│   │   │   ├── Store.tsx             # Tienda virtual
│   │   │   ├── About.tsx             # Acerca de
│   │   │   ├── Privacy.tsx           # Privacidad
│   │   │   ├── TermCond.tsx          # Términos y condiciones
│   │   │   └── Stats.tsx             # Estadísticas
│   │   │
│   │   ├── components/                # Componentes reutilizables
│   │   │   ├── Navbar.tsx            # Barra de navegación
│   │   │   ├── Footer.tsx            # Pie de página
│   │   │   ├── Avatar.tsx            # Visualización de avatar
│   │   │   ├── Exercise.tsx          # Componente de ejercicios
│   │   │   ├── LearningPath.tsx      # Visualización del camino
│   │   │   ├── RequireAuth.tsx       # Protección de rutas
│   │   │   ├── equipModal.tsx        # Modal para equipar items
│   │   │   ├── editProfileModal.tsx  # Modal de editar perfil
│   │   │   ├── minigames/            # Componentes de minijuegos
│   │   │   │   ├── MinigameEngine.tsx
│   │   │   │   ├── CategorizeGame.tsx
│   │   │   │   ├── DecisionGame.tsx
│   │   │   │   ├── MochilaGame.tsx
│   │   │   │   ├── SavingsGame.tsx
│   │   │   │   ├── ShopCalculator.tsx
│   │   │   │   └── types.ts
│   │   │   └── ...
│   │   │
│   │   ├── context/                  # Context API
│   │   │   └── AuthContext.tsx       # Contexto de autenticación
│   │   │
│   │   ├── api.ts                    # Configuración de Axios
│   │   ├── App.tsx                   # Componente raíz
│   │   ├── main.tsx                  # Punto de entrada
│   │   └── styles/                   # Estilos globales (si aplica)
│   │
│   ├── public/                        # Archivos estáticos
│   ├── package.json                   # Dependencias
│   ├── tsconfig.json                  # Configuración TypeScript
│   ├── tailwind.config.js             # Configuración TailwindCSS
│   ├── vite.config.ts                 # Configuración Vite
│   └── .eslintrc.json                # Configuración ESLint
│
├── backend/                           # API Express
│   ├── src/
│   │   ├── app.ts                     # Configuración de Express
│   │   ├── server.ts                  # Punto de entrada
│   │   │
│   │   ├── config/                    # Configuración
│   │   │   ├── env.ts                # Variables de entorno
│   │   │   ├── database.ts           # Configuración de BD
│   │   │   ├── constants.ts          # Constantes globales
│   │   │   └── mail.ts               # Configuración de correo
│   │   │
│   │   ├── db/                        # Acceso a base de datos
│   │   │   ├── client.ts             # Cliente Turso
│   │   │   └── turso.ts              # Instancia de Turso
│   │   │
│   │   ├── modules/                   # Módulos funcionales
│   │   │   ├── auth/                 # Autenticación
│   │   │   │   ├── auth.schema.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.middleware.ts
│   │   │   │
│   │   │   ├── usuario/              # Gestión de usuarios
│   │   │   │   ├── usuario.schema.ts
│   │   │   │   ├── usuario.service.ts
│   │   │   │   ├── usuario.controller.ts
│   │   │   │   └── usuario.routes.ts
│   │   │   │
│   │   │   ├── nodo/                 # Módulo de Nodos
│   │   │   │   ├── nodo.schema.ts
│   │   │   │   ├── nodo.service.ts
│   │   │   │   ├── nodo.controller.ts
│   │   │   │   └── nodo.routes.ts
│   │   │   │
│   │   │   ├── actividad/            # Módulo de Actividades
│   │   │   │   ├── actividad.schema.ts
│   │   │   │   ├── actividad.service.ts
│   │   │   │   ├── actividad.controller.ts
│   │   │   │   └── actividad.routes.ts
│   │   │   │
│   │   │   ├── item/                 # Tienda virtual (items)
│   │   │   │   ├── item.schema.ts
│   │   │   │   ├── item.service.ts
│   │   │   │   ├── item.controller.ts
│   │   │   │   └── item.routes.ts
│   │   │   │
│   │   │   ├── mail/                 # Sistema de correos
│   │   │   │   ├── mail.service.ts
│   │   │   │   ├── mail.templates.ts
│   │   │   │   ├── mail.controller.ts
│   │   │   │   ├── mail.routes.ts
│   │   │   │   ├── scheduler.ts
│   │   │   │   ├── tutorReport.service.ts
│   │   │   │   └── mail/
│   │   │   │       └── react/
│   │   │   │           └── templates/ # Templates de correos
│   │   │   │
│   │   │   └── lecciones/            # ⚠️ DEPRECATED (en desuso)
│   │   │
│   │   ├── shared/                    # Código compartido
│   │   │   ├── middlewares/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── role.middleware.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── jwt.ts
│   │   │   │   ├── hash.ts
│   │   │   │   ├── fisherYates.ts
│   │   │   │   └── random.ts
│   │   │   │
│   │   │   └── mail/
│   │   │       └── react/
│   │   │           └── templates/     # Templates React para correos
│   │   │
│   │   ├── services/                  # Servicios
│   │   │   └── mantenimiento/
│   │   │       └── cleanup.service.ts
│   │   │
│   │   ├── routes/                    # Rutas especiales
│   │   │   └── me.route.ts
│   │   │
│   │   └── utils/                     # Utilidades (deprecadas)
│   │
│   ├── schemas/
│   │   └── schema.sql                 # Esquema de base de datos
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── .env                           # Variables de entorno
│
├── ml-service/                        # Servicio ML (Python)
│   ├── app/
│   │   ├── main.py                    # Punto de entrada FastAPI
│   │   ├── seed.py                    # Seeding de datos
│   │   ├── services/
│   │   │   ├── kmeans.py              # K-Means clustering
│   │   │   ├── report_generator.py    # Generación de reportes PDF
│   │   │   ├── mailer.py              # Envío de correos
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── requirements.txt                # Dependencias Python
│   ├── venv/                           # Virtual environment
│   └── .env
│
├── docs/                              # Documentación
│   ├── PROJECT_DOCUMENTATION.md       # Este archivo
│   └── ...
│
├── package.json                       # Configuración de workspace
├── pnpm-workspace.yaml                # Configuración de pnpm
├── pnpm-lock.yaml                     # Lock file
├── README.md                          # README general
├── ARCHITECTURE.md                    # Arquitectura (algunas partes desactualizadas)
└── .env                               # Variables de entorno globales
```

---

## 🗄️ Base de Datos

### Diagrama Relacional

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIOS                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │ id (PK)                                          │   │
│  │ email (UNIQUE)                                   │   │
│  │ password (hashed)                                │   │
│  │ nombre (UNIQUE)                                  │   │
│  │ rol (estudiante|tutor|admin)                     │   │
│  │ experiencia_total                                │   │
│  │ monedas_virtuales                                │   │
│  │ nivel_actual                                     │   │
│  │ activo (boolean)                                 │   │
│  │ created_at, updated_at                           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
           │
           ├─────────────────────┬───────────────────────┬────────────────────┐
           ▼                     ▼                       ▼                    ▼
    ┌────────────────┐  ┌──────────────────┐  ┌─────────────────┐  ┌────────────────┐
    │ AVATAR         │  │ REFRESH_TOKENS   │  │ PROGRESO_NODO   │  │ PROGRESO_ACT.. │
    ├────────────────┤  ├──────────────────┤  ├─────────────────┤  ├────────────────┤
    │ id_avatar (PK) │  │ id (PK)          │  │ id_progreso(PK) │  │ id_progreso(PK)│
    │ id_usuario (FK)│  │ usuario_id (FK)  │  │ id_usuario (FK) │  │ id_usuario (FK)│
    │ color_piel     │  │ token_hash       │  │ id_nodo (FK)    │  │ id_actividad..(│
    │                │  │ expires_at       │  │ estado          │  │ estado         │
    │                │  │ revoked          │  │ mejor_puntaje   │  │ mejor_puntaje  │
    │                │  │                  │  │                 │  │                │
    └────────────────┘  └──────────────────┘  └─────────────────┘  └────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      NODOS                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ id_nodo (PK)                                     │   │
│  │ titulo                                           │   │
│  │ descripcion                                      │   │
│  │ orden_secuencial                                 │   │
│  │ topico                                           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│                     ACTIVIDADES                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ id_actividad (PK)                                │   │
│  │ id_nodo (FK)                                     │   │
│  │ tipo_actividad (lectura|ejercicio|minijuego)    │   │
│  │ puntos_otorgados                                 │   │
│  │ es_aleatorio                                     │   │
│  │ orden_secuencial                                 │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
       │
       ├────────────────┬──────────────────┬─────────────────┐
       ▼                ▼                  ▼                 ▼
   ┌────────┐    ┌──────────────┐  ┌────────────┐    ┌──────────────┐
   │ LECTURA│    │ EJERCICIO    │  │ MINIJUEGO  │    │ INTENTO_ACT..│
   ├────────┤    ├──────────────┤  ├────────────┤    ├──────────────┤
   │id_act..|    │id_actividad..|  │id_actividad│    │ id_intento(PK
   │cuerpo_ │    │nivel_dif...  │  │titulo_pan..│    │ id_usuario(FK
   │texto   │    │minimo_apro.. │  │historia_i..│    │ id_actividad.
   │url_mul │    │es_de_salto   │  │config_json │    │ fecha_hora
   │        │    │              │  │retro_json  │    │ puntaje_obte
   └────────┘    └──────────────┘  └────────────┘    │ detalle_resp
                       │                            └──────────────┘
                       ▼
            ┌──────────────────────┐
            │ EJERCICIO_PREGUNTA   │
            ├──────────────────────┤
            │ id_actividad (PK/FK) │
            │ id_pregunta (PK/FK)  │
            └──────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ PREGUNTA             │
            ├──────────────────────┤
            │ id_pregunta (PK)     │
            │ enunciado            │
            │ tipo_pregunta        │
            │ nivel_dificultad     │
            │ respuesta_correcta   │
            │ opciones (JSON)      │
            │ topico               │
            │ puntos               │
            └──────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                        TIENDA                            │
│  ┌───────────────────────────────────────────────────┐   │
│  │ ITEM                  │  USUARIO_ITEM              │   │
│  ├───────────────────────┼────────────────────────┐   │   │
│  │ id_item (PK)          │ id_usuario (PK/FK)     │   │   │
│  │ nombre                │ id_item (PK/FK)        │   │   │
│  │ tipo                  │ equipado (boolean)     │   │   │
│  │ precio (en monedas)   └────────────────────────┘   │   │
│  │ svg_capa              │                           │   │
│  └───────────────────────┴────────────────────────────│   │
└──────────────────────────────────────────────────────────┘
```

### Tablas Principales

#### 1. **USUARIOS** - Información de usuarios
- Almacena credenciales, roles, puntos y nivel
- Roles: `estudiante`, `tutor`, `admin`
- Genera automáticamente progreso inicial via triggers

#### 2. **NODOS** - Unidades educativas
- Organizan las actividades de forma secuencial
- Cada nodo contiene múltiples actividades

#### 3. **ACTIVIDADES** - Componentes educativos
- Tres tipos: lecturas, ejercicios, minijuegos
- Pueden ser aleatorios
- Ordenadas secuencialmente dentro de un nodo

#### 4. **LECTURAS** - Contenido teórico
- Texto y recursos multimedia
- Asociadas a una actividad

#### 5. **EJERCICIOS** - Actividades interactivas
- Pueden tener dificultad adaptativa
- Incluyen preguntas con opciones múltiples

#### 6. **PREGUNTAS** - Componentes de ejercicios
- Varias opciones de respuesta
- Pueden estar marcadas como correctas
- Asociadas a tópicos

#### 7. **MINIJUEGOS** - Actividades lúdicas
- Títulos, historia, configuración JSON
- Retroalimentación personalizable

#### 8. **PROGRESO_NODO** - Rastreo de progreso
- Estados: `bloqueada`, `disponible`, `completada`
- Mejor puntaje por nodo

#### 9. **PROGRESO_ACTIVIDAD** - Progreso detallado
- Estados: `bloqueada`, `disponible`, `completada`
- Mejor puntaje por actividad

#### 10. **INTENTO_ACTIVIDAD** - Historial de intentos
- Cuando intentó, qué respondió, qué puntuación obtuvo

#### 11. **AVATAR** - Avatares personalizables
- Color de piel personalizable
- Uno por usuario

#### 12. **ITEM y USUARIO_ITEM** - Tienda virtual
- Items que los usuarios pueden comprar con monedas virtuales
- Registro de qué items posee cada usuario y si están equipados

### Triggers Automáticos

La base de datos incluye triggers que automatizan:

1. **`init_user_progress`**: Cuando se registra un usuario, crea registros de progreso para todos los nodos/actividades
2. **`init_user_node_progress`**: Inicializa progreso de nodos
3. **`init_activity_progress`**: Cuando se agrega una actividad, la hace disponible para todos los usuarios
4. **`unlock_next_activity`**: Desbloquea la siguiente actividad cuando se completa una
5. **`complete_node_when_all_activities_done`**: Marca un nodo como completado cuando todas sus actividades lo están
6. **`unlock_next_node_when_completed`**: Desbloquea el siguiente nodo

---

## 🌐 Backend API

### Características Principales

- **RESTful**: Sigue convenciones REST
- **Modular**: Organizado en módulos por funcionalidad
- **Validado**: Todas las entradas validadas con Zod
- **Autenticado**: JWT para proteger endpoints
- **Seguro**: Helmet, CORS, rate limiting
- **Documentado**: Cada endpoint está documentado

### Endpoints Principales

#### Autenticación (`/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/register` | Registrar nuevo usuario |
| `POST` | `/auth/login` | Iniciar sesión |
| `POST` | `/auth/refresh` | Refrescar token JWT |
| `POST` | `/auth/logout` | Cerrar sesión |
| `POST` | `/auth/confirm-change` | Confirmar cambio de correo |
| `POST` | `/auth/reset-password` | Resetear contraseña |

**Ejemplo: Registro**
```typescript
POST /auth/register
{
  "email": "estudiante@ejemplo.com",
  "password": "MiContraseña123!",
  "nombre": "Juan",
  "tutor_email": "tutor@ejemplo.com" // Opcional
}

Response: {
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "uuid-123",
    "email": "estudiante@ejemplo.com",
    "nombre": "Juan",
    "rol": "estudiante"
  }
}
```

#### Usuarios (`/usuario`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/usuario/me` | Obtener perfil del usuario actual |
| `PUT` | `/usuario/me` | Actualizar perfil |
| `GET` | `/usuario/:id` | Obtener datos públicos de un usuario |
| `GET` | `/usuario/me/avatar` | Obtener configuración del avatar |
| `PUT` | `/usuario/me/avatar` | Actualizar avatar |

**Ejemplo: Obtener Perfil**
```typescript
GET /usuario/me
Headers: { Authorization: "Bearer TOKEN" }

Response: {
  "id": "uuid-123",
  "email": "estudiante@ejemplo.com",
  "nombre": "Juan",
  "rol": "estudiante",
  "experiencia_total": 1250,
  "monedas_virtuales": 500,
  "nivel_actual": "5",
  "estadisticas": {
    "nodosCompletados": 3,
    "actividadesCompletadas": 15,
    "puntajePromedio": 85.5,
    "racha_dias": 5
  },
  "avatar": {
    "color_piel": "#F5A962"
  }
}
```

#### Nodos (`/nodos`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/nodos` | Listar todos los nodos con actividades |
| `GET` | `/nodos/:id` | Obtener un nodo específico |

**Respuesta de Nodos**
```typescript
GET /nodos

Response: [
  {
    "id_nodo": "nodo-1",
    "titulo": "Introducción a Finanzas Personales",
    "descripcion": "Aprende lo básico sobre gestión de dinero",
    "orden_secuencial": 1,
    "topico": "finanzas-basicas",
    "actividades": [
      {
        "id_actividad": "act-1",
        "tipo_actividad": "lectura",
        "orden_secuencial": 1,
        "es_de_salto": false
      },
      {
        "id_actividad": "act-2",
        "tipo_actividad": "ejercicio",
        "orden_secuencial": 2,
        "es_de_salto": true
      }
    ],
    "progreso": {
      "estado": "disponible", // bloqueada|disponible|completada
      "mejor_puntaje": null,
      "actividades_completadas": 0,
      "total_actividades": 5
    }
  }
]
```

#### Actividades (`/actividades`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/actividades/:id` | Obtener detalles de una actividad |
| `POST` | `/actividades/:id/responder` | Enviar respuesta a una actividad |
| `POST` | `/actividades/:id/completar` | Marcar actividad como completada |

**Ejemplo: Obtener Actividad de Lectura**
```typescript
GET /actividades/act-1
Headers: { Authorization: "Bearer TOKEN" }

Response: {
  "id_actividad": "act-1",
  "id_nodo": "nodo-1",
  "tipo_actividad": "lectura",
  "puntos_otorgados": 50,
  "es_aleatorio": false,
  "orden_secuencial": 1,
  "lectura": {
    "cuerpo_texto": "Lorem ipsum dolor sit amet...",
    "url_multimedia": "https://ejemplo.com/imagen.jpg"
  }
}
```

**Ejemplo: Obtener Actividad de Ejercicio**
```typescript
GET /actividades/act-2
Headers: { Authorization: "Bearer TOKEN" }

Response: {
  "id_actividad": "act-2",
  "id_nodo": "nodo-1",
  "tipo_actividad": "ejercicio",
  "puntos_otorgados": 100,
  "es_aleatorio": true,
  "orden_secuencial": 2,
  "ejercicio": {
    "nivel_dificultad": 2,
    "minimo_aprobatorio": 70,
    "es_de_salto": true
  },
  "preguntas": [
    {
      "id_pregunta": "preg-1",
      "enunciado": "¿Cuál es la capital de Francia?",
      "tipo_pregunta": "multiple_choice",
      "nivel_dificultad": 1,
      "opciones": ["París", "Lyon", "Marsella", "Burdeos"],
      "puntos": 25
    }
  ]
}
```

#### Ítems (Tienda) (`/items`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/items` | Listar todos los ítems disponibles |
| `GET` | `/items/usuario/inventory` | Inventario del usuario |
| `POST` | `/items/:id/comprar` | Comprar un ítem |
| `POST` | `/items/:id/equipar` | Equipar/desequipar un ítem |

**Ejemplo: Comprar Ítem**
```typescript
POST /items/item-123/comprar
Headers: { Authorization: "Bearer TOKEN" }

Response: {
  "success": true,
  "message": "Ítem comprado exitosamente",
  "inventario": {
    "monedas_restantes": 350,
    "items_nuevos": ["item-123"]
  }
}
```

#### Correos (`/mail`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/mail/send-test` | Enviar correo de prueba |
| `POST` | `/mail/generate-report` | Generar y enviar reporte |

#### Ruta Especial (`/api/me`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/me` | Endpoint público para obtener info del usuario actual (decorador) |

### Flujo de Autenticación

```
1. Usuario completa formulario de login
   └─> Frontend envía POST /auth/login

2. Backend valida credenciales
   └─> Compara password hasheado con bcrypt
   └─> Si falla, retorna 401

3. Backend genera tokens JWT
   └─> Access token (corta duración, 1 hora)
   └─> Refresh token (larga duración, 7 días, almacenado en BD)

4. Frontend guarda tokens en memoria + cookies
   └─> Headers: Authorization: Bearer {access_token}

5. Para cada request autenticado
   └─> Middleware valida JWT
   └─> Extrae userId y rol del token
   └─> Adjunta a req.user

6. Cuando token expira
   └─> Frontend usa refresh token para obtener nuevo access token
   └─> POST /auth/refresh

7. Al logout
   └─> Backend revoca el refresh token
   └─> Frontend borra tokens locales
```

### Validación de Datos (Zod)

El backend utiliza Zod para validar todas las entradas:

```typescript
// Ejemplo de schema
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Contraseña debe tener al menos 8 caracteres")
});

// En controller
try {
  const data = loginSchema.parse(req.body);
  // data está validado y tipado
} catch (error: any) {
  if (error.name === 'ZodError') {
    return res.status(400).json({ errors: error.errors });
  }
}
```

### Manejo de Errores

Todos los endpoints siguen este patrón de respuesta:

```typescript
// Éxito
{
  "success": true,
  "data": { ... }
}

// Error de validación
{
  "error": "Validación fallida",
  "details": [
    { path: ["email"], message: "Email inválido" }
  ]
}

// Error de negocio
{
  "error": "Contraseña incorrecta"
}

// Error de servidor
{
  "error": "Error interno del servidor"
}
```

---

## 🎨 Frontend

### Arquitectura de Componentes

```
App
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   └── User Menu
├── Routes
│   ├── Home (público)
│   ├── Login (público)
│   ├── Register (público)
│   ├── ForgotPassword (público)
│   ├── TermCond (público)
│   ├── Privacy (público)
│   ├── About (público)
│   ├── ConfirmUpdate (mixto)
│   │
│   └── ProtectedRoutes (RequireAuth)
│       ├── Path (Mapa de nodos)
│       ├── Lesson (Reproductor de actividades)
│       │   ├── LearningPath (Visualización del nodo)
│       │   ├── Exercise (Componente de ejercicios)
│       │   ├── MinigameEngine (Motor de minijuegos)
│       │   │   ├── CategorizeGame
│       │   │   ├── DecisionGame
│       │   │   ├── MochilaGame
│       │   │   ├── SavingsGame
│       │   │   └── ShopCalculator
│       │   └── Reading (Lector de contenido)
│       │
│       ├── Profile (Perfil del usuario)
│       │   ├── Avatar (Visualizador/editor)
│       │   ├── editProfileModal
│       │   ├── Stats (Estadísticas)
│       │   └── Settings
│       │
│       └── Store (Tienda virtual)
│           ├── equipModal
│           └── Item Grid
│
└── Footer
    ├── Links
    └── Copyright
```

### Páginas Principales

#### 1. **Home** (`/`)
- Landing page pública
- Información sobre la plataforma
- Llamada a la acción para registrarse

#### 2. **Login** (`/login`)
- Formulario de inicio de sesión
- Validación de credenciales
- Redirección al dashboard si ya está autenticado
- Opción de "Olvidé mi contraseña"

#### 3. **Register** (`/register` y `/register/user`)
- Primer paso: Seleccionar si es estudiante o tutor
- Segundo paso: Formulario de registro
- Campos: email, contraseña, nombre, tutor email (opcional)
- Validación en tiempo real con Zod

#### 4. **Path** (`/path`)
- Visualización completa del camino de aprendizaje
- Muestra todos los nodos secuencialmente
- Indica estado de cada nodo (bloqueado, disponible, completado)
- Permite navegar directamente a un nodo disponible

#### 5. **Lesson** (`/lesson/:id`)
- Reproductor de actividades
- Muestra el nodo actual y sus actividades
- Carga dinámicamente según tipo:
  - **Lectura**: Texto + multimedia
  - **Ejercicio**: Preguntas interactivas con validación
  - **Minijuego**: Motor de minijuegos personalizable

#### 6. **Profile** (`/profile`)
- Información del usuario
- Avatar personalizable
- Estadísticas de progreso
- Inventario de ítems
- Información del tutor asignado

#### 7. **Store** (`/store`)
- Catálogo de ítems cosméticos
- Filtrado por categoría
- Compra con monedas virtuales
- Visualización de ítems equipados

#### 8. **Stats** (`/stats`)
- Gráficos de progreso
- Análisis de desempeño
- Comparativa semanal/mensual

#### 9. **About** (`/about`)
- Información sobre la plataforma
- Equipo de desarrollo
- Misión y visión

#### 10. **Privacy** (`/privacy`)
- Política de privacidad
- Tratamiento de datos

#### 11. **TermCond** (`/terms`)
- Términos y condiciones

### Gestión de Estado

Utiliza **Zustand** para estado global:

```typescript
// Ejemplo de store de autenticación
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false })
}));
```

### Contexto de Autenticación

`AuthContext` proporciona:
- Estado de autenticación global
- Métodos de login/logout
- Información del usuario
- Verificación de autorización

### Minijuegos

El frontend incluye un motor de minijuegos flexible que soporta:

#### **Tipos de Minijuegos:**

1. **CategorizeGame** - Clasificar elementos en categorías
2. **DecisionGame** - Tomar decisiones con consecuencias
3. **MochilaGame** - Gestionar una mochila con limitaciones
4. **SavingsGame** - Simulador de ahorros e inversiones
5. **ShopCalculator** - Cálculos rápidos de compras

#### **Estructura de Configuración:**

```typescript
{
  "type": "categorize",
  "title": "Categoriza los gastos",
  "items": [
    { "id": "1", "label": "Comida", "category": "esencial" },
    { "id": "2", "label": "Videojuego", "category": "ocio" }
  ],
  "categories": ["esencial", "ocio", "ahorro"],
  "feedback": {
    "correct": "¡Muy bien categorizado!",
    "incorrect": "Intenta de nuevo"
  }
}
```

---

## 🤖 ML Service

### Funcionalidades

#### 1. **K-Means Clustering**

Analiza el desempeño de los estudiantes agrupándolos por patrones similares:

```
┌──────────────────────────────────────┐
│   Datos de Estudiantes               │
│   - Puntajes                         │
│   - Tiempo dedicado                  │
│   - Número de intentos               │
│   - Tasa de progreso                 │
└──────────────────────────┬───────────┘
                           │
                           ▼
┌──────────────────────────────────────┐
│   K-Means Clustering (k=3)           │
│   ├─ Cluster 1: Alto desempeño      │
│   ├─ Cluster 2: Desempeño normal    │
│   └─ Cluster 3: Bajo desempeño      │
└──────────────────────────┬───────────┘
                           │
                           ▼
┌──────────────────────────────────────┐
│   Análisis y Recomendaciones         │
│   - Identificar patrones             │
│   - Detectar estudiantes en riesgo   │
│   - Sugerir intervenciones           │
└──────────────────────────────────────┘
```

#### 2. **Generación de Reportes PDF**

- Incluye gráficos de progreso (matplotlib)
- Recomendaciones personalizadas
- Tabla de resumen de estudiantes
- Análisis por tópico/actividad

#### 3. **Envío de Correos con Reportes**

Integración con Resend para enviar reportes a tutores automáticamente.

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Verificar estado del servicio |
| `POST` | `/generate-report` | Generar y enviar reporte semanal |

**Ejemplo:**
```typescript
POST /generate-report

Response: {
  "message": "Reporte enviado con éxito",
  "resend_status": "email_sent"
}
```

### Proceso de Generación de Reportes

```
1. Scheduler (node-cron) dispara `/generate-report`
   └─ Configurado para ejecutarse cada lunes a las 9 AM

2. ML Service se conecta a la base de datos
   └─ Obtiene datos de estudiantes de la semana anterior

3. Ejecuta K-Means clustering
   └─ Agrupa estudiantes por desempeño

4. Genera gráficos con matplotlib
   └─ Gráficos de progreso, distribución de clusters

5. Crea PDF con ReportLab
   └─ Incluye gráficos, tablas, recomendaciones

6. Envía por correo con Resend
   └─ Destinatarios: tutores

7. Limpia archivos temporales
```

---

## 📧 Sistema de Correos

### Configuración

Utiliza **Resend** como servicio de correos transaccionales:

```typescript
// config/mail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(
  email: string,
  subject: string,
  html: string
) {
  return resend.emails.send({
    from: 'noreply@monilab.com.mx',
    to: email,
    subject,
    html
  });
}
```

### Tipos de Correos

#### 1. **Bienvenida** (`WelcomeEmail`)
- Se envía después del registro
- Confirma la creación de cuenta
- Incluye enlace a la plataforma

#### 2. **Bajo Rendimiento** (`LowPerformanceEmail`)
- Se envía cuando un estudiante tiene dificultades
- Señala qué actividad está siendo difícil
- Incluye sugerencias de mejora

#### 3. **Confirmación de Cambio** (`ConfirmChangeEmail`)
- Cuando el usuario intenta cambiar su correo
- Requiere confirmación por enlace

#### 4. **Reset de Contraseña** (`ResetPasswordEmail`)
- Enlace para restablecer contraseña
- Válido por 24 horas

#### 5. **Reporte de Tutor** (`TutorReportEmail`)
- Análisis semanal de estudiantes
- Incluye gráficos y recomendaciones
- Se envía como PDF adjunto

#### 6. **Reporte Batch** (`TutorBatchEmail`)
- Resumen general para múltiples tutores
- Agregaciones de datos

### Plantillas React Email

Las plantillas están en `backend/src/shared/mail/react/templates/`:

```typescript
// Ejemplo simplificado
function WelcomeEmail({ nombre }) {
  return (
    <Html>
      <Body>
        <Text>¡Hola {nombre}!</Text>
        <Text>Bienvenido a Moni-Lab</Text>
        <Button href="https://app.monilab.com.mx">
          Acceder a la plataforma
        </Button>
      </Body>
    </Html>
  );
}
```

### Scheduler de Correos

Utiliza **node-cron** para tareas automáticas:

```typescript
// modules/mail/scheduler.ts
import cron from 'node-cron';

export function initMailScheduler() {
  // Ejecutar cada lunes a las 9 AM
  cron.schedule('0 9 * * 1', async () => {
    console.log('Generando reportes semanales...');
    // Lógica de generación de reportes
  });
}
```

---

## 📄 Generación de PDFs

### Tecnologías

- **Backend**: Puppeteer (headless browser)
- **ML Service**: ReportLab (biblioteca Python)

### Procesos

#### 1. **PDF Desde HTML (Backend)**

```typescript
import puppeteer from 'puppeteer';

export async function generatePdfFromHtml(html: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });

  await browser.close();
  return pdf;
}
```

#### 2. **PDF Desde Python (ML Service)**

```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

pdf = canvas.Canvas("reporte.pdf", pagesize=letter)
pdf.drawString(100, 750, "Reporte de Estudiantes")
# ... más contenido
pdf.save()
```

### Tipos de PDFs Generados

1. **Reporte Semanal** - Incluye gráficos de K-Means clustering
2. **Certificados de Completitud** - Cuando un estudiante termina un nodo
3. **Historial de Intentos** - Detalles de intentos de ejercicios

---

## 🔄 Flujo de Datos

### Caso de Uso: Un Estudiante Completa una Actividad

```
1. USUARIO ACCEDE A LA ACTIVIDAD
   Frontend: GET /actividades/:id (con JWT)
   Backend: Valida JWT, obtiene detalles de activity
   Response: Estructura completa de la actividad

2. USUARIO RESPONDE PREGUNTAS
   Frontend: Recopila respuestas del usuario

3. USUARIO ENVÍA RESPUESTAS
   Frontend: POST /actividades/:id/responder
   {
     "respuestas": [
       { "pregunta_id": "q1", "respuesta": "Paris" },
       { "pregunta_id": "q2", "respuesta": "B" }
     ]
   }

4. BACKEND VALIDA RESPUESTAS
   - Calcula puntaje
   - Compara con respuestas correctas
   - Determina si está aprobada

5. BACKEND ACTUALIZA PROGRESO
   - Actualiza progreso_actividad (estado)
   - Registra puntaje
   - Crea intento_actividad
   - Suma experiencia/monedas al usuario

   Triggers automáticos:
   - Si actividad completada → desbloquea siguiente
   - Si todas actividades del nodo completadas → nodo completado
   - If nodo completado → desbloquea siguiente nodo

6. BACKEND VERIFICA BAJO RENDIMIENTO
   Si puntaje < 50:
   - Queued: Enviar correo de "Bajo Rendimiento"

7. BACKEND VERIFICA PARA SCHEDULER ML
   Si es lunes 9 AM:
   - Dispara generación de reporte semanal
   - ML Service: Obtiene datos, calcula clusters, genera PDF
   - Mail Service: Envía a tutores

8. FRONTEND RECIBE RESPUESTA
   Backend: {
     "success": true,
     "puntaje": 85,
     "estado": "completada",
     "experiencia_ganada": 100,
     "monedas_ganadas": 50,
     "siguiente_disponible": true
   }

9. FRONTEND ACTUALIZA UI
   - Muestra puntaje
   - Celebración con confeti
   - Desbloquea siguiente actividad
   - Actualiza progreso visual
```

### Comunicación Backend ↔ ML Service

```
Backend                              ML Service
   │                                     │
   ├──────── POST /generate-report ─────>│
   │                                     │
   │                                     ├──> Conecta a BD Turso
   │                                     ├──> K-Means clustering
   │                                     ├──> Genera gráficos
   │                                     ├──> Crea PDF
   │                                     │
   │<─────────────── Response ───────────┤
   │
   ├──> Obtiene lista de tutores
   ├──> Manda correos con PDF
```

---

## 🌍 Deployment y Hosting

### Arquitectura de Deployment

```
┌────────────────────────────────────────────────────────────┐
│                     USUARIOS/CLIENTES                      │
└────────────────────────────┬───────────────────────────────┘
                             │ HTTPS
                ┌────────────┴────────────┐
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │   VERCEL     │          │   RAILWAY    │
        │  (Frontend)  │◄────────►│   (Backend)  │
        │   React App  │ REST API │ Express.js   │
        └──────────────┘          └──────┬───────┘
                │                        │
                │                        │ SQL
                │                  ┌─────▼──────┐
                │                  │   TURSO    │
                │                  │  SQLite    │
                │                  │ Database   │
                │                  └────────────┘
                │
                │                  ┌──────────────┐
                ├─────────────────►│   RAILWAY    │
                │   HTTP Requests  │ (ML Service) │
                │                  │   FastAPI    │
                │                  └──────────────┘
                │
                │                  ┌──────────────┐
                └─────────────────►│   RESEND     │
                   Email Requests  │  Email API   │
                                   └──────────────┘
```

### Vercel (Frontend)

**Características:**
- Edge runtime global
- Serverless functions
- Deployments automáticos desde Git
- SSL/TLS automático
- CDN global

**Configuración:**
```javascript
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "https://api.monilab.com.mx"
  }
}
```

### Railway (Backend y ML Service)

**Características:**
- PostgreSQL/SQLite soportado
- Variables de entorno seguras
- Logs en tiempo real
- Deployments automáticos

**Backend en Railway:**
```
Instancia: Node.js + TypeScript
Puerto: 3000
Variables:
  - DATABASE_URL: Turso
  - JWT_SECRET: Token signing key
  - RESEND_API_KEY: Email API
```

**ML Service en Railway:**
```
Instancia: Python 3.x
Puerto: 8000
Variables:
  - DATABASE_URL: Turso
  - RESEND_API_KEY: Email API
```

### Turso (Base de Datos)

**Características:**
- SQLite distribuido
- Replicación automática
- Backup automático
- Compatible con LibSQL

**Conexión:**
```typescript
// Desde backend
import { Client } from "@libsql/client";

const db = new Client({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
```

### Resend (Correos)

**Características:**
- API REST para envío de correos
- Soporte para React components como templates
- Analytics de apertura y clicks
- Domain verification

**Configuración:**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

resend.emails.send({
  from: 'noreply@monilab.com.mx',
  to: 'usuario@ejemplo.com',
  subject: 'Bienvenido',
  html: '<h1>¡Bienvenido a Moni-Lab!</h1>'
});
```

### CI/CD Pipeline

```
GitHub Push
    │
    ├──> Frontend Branch
    │    └──> Vercel Build & Deploy
    │        └──> Tests
    │        └──> Build
    │        └──> Deploy to Production
    │
    └──> Backend Branch
         └──> Railway Build & Deploy
              └──> Tests
              └──> Build Container
              └──> Deploy to Production
```

---

## 🚀 Guías de Uso

### Para Desarrolladores

#### Configuración Local

**Requisitos:**
- Node.js 18+
- npm o pnpm
- Python 3.8+ (para ML service)
- Git

**Instalación:**

```bash
# Clonar repositorio
git clone https://github.com/DmitryRCCN/Moni-Lab.git
cd Moni-Lab

# Instalar dependencias del workspace
pnpm install

# Configurar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp ml-service/.env.example ml-service/.env

# Llenar variables con valores locales
# - DATABASE_URL: conexión local o Turso
# - JWT_SECRET: cualquier string
# - RESEND_API_KEY: dejar vacío o usar key de desarrollo
```

**Iniciar desarrollo:**

```bash
# Terminal 1: Frontend
cd frontend
pnpm run dev
# Acceder a http://localhost:5173

# Terminal 2: Backend
cd backend
pnpm run dev
# API en http://localhost:3000

# Terminal 3: ML Service
cd ml-service
python -m venv venv
source venv/bin/activate  # o .\venv\Scripts\activate en Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
# ML en http://localhost:8000
```

#### Crear un Nuevo Módulo

```bash
# 1. Crear carpeta
mkdir -p backend/src/modules/mi_modulo

# 2. Crear archivos
touch backend/src/modules/mi_modulo/{schema,service,controller,routes}.ts

# 3. Seguir patrón de ARCHITECTURE.md

# 4. Registrar en app.ts
```

#### Ejecutar Tests

```bash
cd backend
pnpm test

# O test específico
pnpm test -- usuario.test.ts
```

### Para Tutores/Administradores

#### Acceder al Dashboard

1. Ir a https://app.monilab.com.mx
2. Registro como "Tutor" o "Admin"
3. Recibir correos semanales con reportes

#### Interpretar Reportes

**Clusters de Desempeño:**
- **Verde (Alto)**: Estudiantes con >80% promedio
- **Amarillo (Medio)**: Estudiantes con 60-80%
- **Rojo (Bajo)**: Estudiantes con <60%

**Recomendaciones:**
- Cluster Alto: Mantener ritmo actual
- Cluster Medio: Refuerzo en temas específicos
- Cluster Bajo: Intervención urgente

### Para Estudiantes

#### Navegar la Plataforma

1. **Registro**: Ingresar email y crear contraseña
2. **Path**: Ver el mapa completo de aprendizaje
3. **Lecciones**: Completa actividades en orden
4. **Rewards**: Gana XP y monedas
5. **Store**: Personaliza tu avatar

#### Consejos

- Completa todas las lecturas antes de ejercicios
- Repite ejercicios hasta dominar
- Juega minijuegos para ganar bonus XP
- Personaliza tu avatar con ítems de la tienda

---

## 🔐 Seguridad

### Prácticas Implementadas

1. **Autenticación JWT**
   - Access tokens de corta duración
   - Refresh tokens seguros

2. **Hashing de Contraseñas**
   - Bcrypt con salt rounds configurable

3. **CORS**
   - Solo dominios permitidos

4. **Rate Limiting**
   - Previene fuerza bruta
   - Límites por IP y usuario

5. **Helmet.js**
   - Headers de seguridad HTTP

6. **Validación de Entrada**
   - Zod en todos los endpoints

7. **Autorización**
   - Verificación de roles y permisos
   - Solo acceso a datos propios

---

## 📊 Métricas y Monitoreo

### KPIs Rastreados

- **Tasa de Completitud**: % de estudiantes que completan nodos
- **Tiempo Promedio**: Tiempo dedicado por actividad
- **Desempeño**: Puntaje promedio por tópico
- **Retención**: % de usuarios activos vs registrados
- **Engagement**: Frecuencia de acceso

### Logs

**Backend**: Winston o console.log
**Frontend**: GA (Google Analytics) o similar
**ML**: Logs de FastAPI

---

## 📝 Roadmap Futuro

### Fase Próxima

- [ ] Sistema de badges/medallas
- [ ] Competiciones entre estudiantes
- [ ] Foros de discusión
- [ ] Tutorías 1-a-1 virtuales
- [ ] Exportación de certificados
- [ ] Análisis de ML más avanzados
- [ ] Integración con LMS externos

---

## 📞 Contacto y Soporte

**Email**: support@monilab.com.mx
**GitHub**: https://github.com/DmitryRCCN/Moni-Lab
**Website**: https://www.monilab.com.mx

---

## 📄 Glosario

- **Nodo**: Unidad de aprendizaje que contiene actividades
- **Actividad**: Componente individual (lectura, ejercicio, minijuego)
- **Progreso**: Rastreo del avance de un usuario
- **XP**: Puntos de experiencia
- **JWT**: JSON Web Token para autenticación
- **Turso**: Base de datos SQLite distribuida
- **K-Means**: Algoritmo de clustering para análisis
- **Resend**: Servicio de correos transaccionales

---

**Fin del Documento**

*Última actualización: Abril 2026*
*Versión: 1.0*
*Estado: ✅ Actualizado y en producción*
