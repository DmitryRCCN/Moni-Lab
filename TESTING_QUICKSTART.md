# 🧪 Guía Rápida de Testing - Moni-Lab

## ✅ Status Actual

- ✅ **Backend unitarios**: 8/8 PASANDO
- ⏸️ **Frontend tests**: Pendiente instalación deps
- 🔜 **E2E**: Futuro (Playwright)

---

## 📟 Comandos Principales

### 🚀 Ejecutar Tests Backend

```bash
cd backend
pnpm test
```

**Output esperado:**
```
PASS  tests/unit/logica.test.ts
✓ 8 tests passed
```

---

### 🧪 Tests Específicos

```bash
# Solo unitarios
cd backend
pnpm test:unit

# Con watch (se actualiza automáticamente)
cd backend
pnpm test:watch

# Con cobertura
cd backend
pnpm test:coverage
```

---

## 🧩 Qué se Prueba (Backend)

### 🚀 Ejecutar TODO (Frontend + Backend)
```bash
# CD a la raíz del proyecto
cd Moni-Lab

# Ejecutar todas las pruebas
pnpm test

# O equivalente
pnpm run test
```

---

## 🔧 Backend Testing

### ✅ Pruebas Unitarias
```bash
cd backend
pnpm test
# o
pnpm test:unit
```

**Qué prueba:**
- Funciones del service sin dependencias externas
- `hasCompletedPreviousActivities()`
- `getOrCreateIntento()`
- Lógica de modo NORMAL vs SALTO

**Archivos:**
- `backend/tests/unit/actividad.service.test.ts`

---

### 🔗 Pruebas de Integración
```bash
cd backend
pnpm test:integration
```

**Qué prueba:**
- API endpoints completos
- Flujos de usuario reales
- Validación de BD
- Integridad de datos ML

**Archivos:**
- `backend/tests/integration/actividad.integration.test.ts`

---

### 👁️ Modo Watch (Desarrollo)
```bash
cd backend
pnpm test:watch
```

Ejecuta las pruebas automáticamente cuando cambias archivos.

---

### 📊 Cobertura de Código
```bash
cd backend
pnpm test:coverage
```

Genera reporte de cobertura en `coverage/`

---

## 🎨 Frontend Testing

### Prerequisites
Primero instala las dependencias de testing:

```bash
cd frontend

# Instalar Vitest y librerías de testing
pnpm install -D vitest @testing-library/react @testing-library/jsdom jsdom
```

### ✅ Pruebas Unitarias
```bash
cd frontend
pnpm test
```

**Qué prueba:**
- Componentes Exercise
- Componentes LearningPath
- Renderizado correcto
- Estados (NORMAL, SALTO, completada, saltada)

**Archivos:**
- `frontend/src/components/Exercise.test.tsx`
- `frontend/src/components/LearningPath.test.tsx`

---

### 👁️ Modo Watch
```bash
cd frontend
pnpm test:watch
```

---

### 📊 UI de Testing
```bash
cd frontend
pnpm test:ui
```

Abre interfaz visual en navegador para ver tests en tiempo real.

---

### 📊 Cobertura
```bash
cd frontend
pnpm test:coverage
```

---

## 🌍 Pruebas E2E (Completo con UI)

### Setup
1. Iniciar backend y frontend primero:

```bash
# Terminal 1
cd Moni-Lab/backend
pnpm dev

# Terminal 2
cd Moni-Lab/frontend
pnpm dev
```

2. Luego ejecutar E2E (en Terminal 3):

```bash
# WIP: Config de Playwright/Cypress pendiente
# Por ahora, pruebas manuales en http://localhost:5173
```

---

## 🧩 Escenarios de Prueba Clave

### 1️⃣ Usuario Completa Examen Normal
```bash
# Terminal 1: Backend
cd backend && pnpm dev

# Terminal 2: Frontend
cd frontend && pnpm dev

# Terminal 3: Abrir navegador
# 1. Login
# 2. Ir a "Ruta de aprendizaje"
# 3. Seleccionar nodo
# 4. Hacer ejercicio normal
# 5. ✅ Ver "Modo Normal ✏️"
```

---

### 2️⃣ Usuario Completa Examen de Salto
```bash
# 1. Login como usuario nuevo (sin progreso)
# 2. Ir a nodo con examen de salto
# 3. Hacer el examen
# ✅ Ver "Reto de Salto ⚡ (15 preguntas)"
# ✅ Al finalizar, debe guardar como completada
```

---

### 3️⃣ Usuario Reintenta Examen de Salto
```bash
# 1. Login como usuario que YA completó salto
# 2. Ir al mismo nodo
# 3. Reabrir el examen
# ✅ Ver "Modo Normal ✏️" (NO "Reto de Salto")
# ✅ Debe tener 5 preguntas (no 15)
```

---

### 4️⃣ Validar Integridad ML
```bash
cd backend
pnpm test:integration
# ✅ Debe pasar test: "no debe generar puntaje ficticio"
# ✅ Verifica que estado='saltada' existe
# ✅ Verifica que NO hay puntaje 100 ficticio
```

---

## 📋 Checklist de Testing Antes de Deploy

```
[ ] Backend tests pasen
  [ ] pnpm test:backend
  [ ] pnpm test:backend:integration

[ ] Frontend tests pasen
  [ ] pnpm test:frontend

[ ] Coverage aceptable
  [ ] Backend 80%+
  [ ] Frontend 70%+

[ ] Escenarios manuales validados
  [ ] Login funciona
  [ ] Ver nodos funciona
  [ ] Salto nuevo muestra 15 preguntas
  [ ] Salto completado muestra modo NORMAL
  [ ] Progreso se actualiza correctamente

[ ] Integridad ML
  [ ] Estado 'saltada' existe en BD
  [ ] Sin puntajes ficticiios (100)
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
pnpm install

# Específicamente testing libs
pnpm install -D @testing-library/react @testing-library/jsdom vitest jsdom
```

### Tests no corren en watch mode
```bash
# Limpiar cache Jest
pnpm test --clearCache
```

### Timeout en tests
```bash
# Aumentar timeout en jest.config.js o vitest.config.ts
testTimeout: 15000 // 15 segundos
```

---

## 📚 Estructura de Archivos

```
backend/
├── tests/
│   ├── unit/
│   │   └── actividad.service.test.ts
│   └── integration/
│       └── actividad.integration.test.ts
├── jest.config.js
└── package.json

frontend/
├── src/
│   └── components/
│       ├── Exercise.test.tsx
│       └── LearningPath.test.tsx
├── vitest.config.ts
└── package.json
```

---

## 🎯 Próximos Pasos

- [ ] Configurar E2E con Playwright
- [ ] CI/CD GitHub Actions
- [ ] Reportes visuales de cobertura
- [ ] Snapshot tests para componentes
- [ ] Performance tests

---

**Última actualización:** 2 de abril de 2026
