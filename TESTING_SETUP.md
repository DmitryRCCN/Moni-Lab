# Testing Setup - Moni-Lab

## ✅ Qué se ha configurado

### 📁 Estructura de Pruebas Creada

```
Moni-Lab/
│
├── PLAN_PRUEBAS.md                        ← Plan estratégico de testing
├── TESTING_QUICKSTART.md                  ← Guía rápida de ejecución
├── run-tests.js                           ← Script helper para correr tests
│
├── backend/
│   ├── jest.config.js                     ← Config Jest (ya existía)
│   ├── package.json                       ← Scripts de test actualizados
│   └── tests/
│       ├── unit/
│       │   └── actividad.service.test.ts  ← ✨ Pruebas unitarias
│       └── integration/
│           └── actividad.integration.test.ts ← ✨ Pruebas E2E API
│
├── frontend/
│   ├── vitest.config.ts                   ← ✨ Config Vitest (nueva)
│   ├── package.json                       ← Scripts de test actualizados
│   └── src/
│       └── components/
│           ├── Exercise.test.tsx          ← ✨ Pruebas del componente
│           └── LearningPath.test.tsx      ← ✨ Pruebas del componente
│
└── package.json                           ← Scripts monorepo actualizados
```

---

## 🚀 Cómo Usar

### Opción 1: Script Helper (⭐ RECOMENDADO)

```bash
# Ver todas las opciones
node run-tests.js help

# Ejecutar todas las pruebas
node run-tests.js all

# Backend en watch
node run-tests.js watch backend

# Con cobertura
node run-tests.js coverage
```

### Opción 2: Comandos Directos

```bash
# Monorepo (raíz)
pnpm test                          # Todas
pnpm test:backend                  # Solo backend
pnpm test:backend:watch            # Backend en watch
pnpm test:backend:integration      # Integración backend
pnpm test:frontend                 # Solo frontend
pnpm test:coverage                 # Cobertura

# Backend directo
cd backend && pnpm test
cd backend && pnpm test:unit
cd backend && pnpm test:integration

# Frontend directo
cd frontend && pnpm test
cd frontend && pnpm test:watch
cd frontend && pnpm test:ui
```

---

## 📊 Qué se Prueba

### Backend

#### ✅ Unitarias (`actividad.service.test.ts`)
- `getOrCreateIntento()` modo NORMAL
- `getOrCreateIntento()` modo SALTO (nuevo usuario)
- `getOrCreateIntento()` modo NORMAL (usuario que completó SALTO)
- `hasCompletedPreviousActivities()` - verdadero/falso

#### ✅ Integración (`actividad.integration.test.ts`)
- GET `/ejercicio/:id/preguntas` - modo NORMAL
- GET `/ejercicio/:id/preguntas` - modo SALTO
- GET `/ejercicio/:id/preguntas` - completada (volver a NORMAL)
- POST `/ejercicio/respuesta`
- POST `/ejercicio/:id/finalizar`
- GET `/nodos` - con actividades
- **Validaciones ML**: No hay datos ficticiios, estado "saltada" existe

### Frontend

#### ✅ Exercise Component (`Exercise.test.tsx`)
- Renderizar en modo NORMAL ✏️
- Renderizar en modo SALTO ⚡
- Cambiar preguntas al confirmar
- Mostrar resultados finales
- Cargar nuevo intento en NORMAL después de SALTO

#### ✅ LearningPath Component (`LearningPath.test.tsx`)
- Renderizar nodos sin progreso
- Mostrar estado "completada" (check verde)
- Mostrar estado "saltada" (igual visual a completada)
- Mostrar estado "bloqueada" (candado)
- Mostrar estado "disponible"
- Responder a props activeNodeId y activeActivityId

---

## 🎯 Validaciones Críticas (ML Integrity)

Estas pruebas garantizan que OK está bien para el módulo de ML:

✅ **No hay puntaje ficticio**
```sql
-- MAL ❌
UPDATE progreso_actividad 
SET estado='completada', puntaje=100 
WHERE es_de_salto=1;

-- BIEN ✅
UPDATE progreso_actividad 
SET estado='saltada' 
WHERE es_de_salto=1 AND actividades_previas_saltadas;
```

✅ **Estado "saltada" se filtra**
```sql
-- ML queries
SELECT * FROM progreso_actividad 
WHERE estado != 'saltada'  -- Excluye datos ficticiios
AND puntaje IS NOT NULL;
```

✅ **Tests automáticos**
```bash
cd backend && pnpm test:integration
# Verifica test: "no debe generar puntaje ficticio para actividades saltadas"
```

---

## 📋 Dependencias Agregadas

### Backend
```json
{
  "devDependencies": {
    "jest": "^30.2.0",
    "ts-jest": "^29.4.6",
    "supertest": "^7.2.2"
  }
}
```
✅ Ya estaban en package.json

### Frontend
```json
{
  "devDependencies": {
    "vitest": "*",
    "@testing-library/react": "*",
    "@testing-library/jsdom": "*",
    "jsdom": "*"
  }
}
```
⚠️ Requiere instalar: `pnpm install -D vitest @testing-library/react @testing-library/jsdom jsdom`

---

## 🔄 Flujo de Testing Recomendado

### 1️⃣ Desarrollo (Local)
```bash
# Terminal 1: Backend dev + watch tests
cd backend && pnpm dev
# En otra terminal en backend/
pnpm test:watch

# Terminal 2: Frontend dev + watch tests
cd frontend && pnpm dev
# En otra terminal en frontend/
pnpm test:watch
```

### 2️⃣ Antes de Commit
```bash
cd Moni-Lab
pnpm test                  # Todas las pruebas
pnpm test:coverage         # Verificar cobertura
pnpm lint                  # Linting
```

### 3️⃣ Antes de Deploy
```bash
cd Moni-Lab
pnpm test:backend:integration  # Validar integridad
pnpm test:coverage             # Cobertura final
pnpm build                      # Build completo
```

---

## 🛠️ Próximas Mejoras

- [ ] E2E con Playwright (simular UI completa)
- [ ] CI/CD GitHub Actions
- [ ] Reportes visuales de cobertura
- [ ] Snapshot tests para componentes
- [ ] Performance benchmarks
- [ ] API mocking con msw

---

## 🆘 Troubleshooting

### Frontend tests no corren
```bash
# Instalar deps de testing
cd frontend
pnpm install -D vitest @testing-library/react @testing-library/jsdom jsdom

# Verificar vitest.config.ts existe
ls vitest.config.ts
```

### Backend tests con errores de módulos
```bash
# Limpiar cache Jest
cd backend
pnpm test --clearCache

# Reinstalar
pnpm install
```

### Timeout en tests
Aumentar en config:
- Backend: `jest.config.js` → `testTimeout: 15000`
- Frontend: `vitest.config.ts` → `test: { testTimeout: 15000 }`

---

## 📚 Recursos

- [Jest Docs](https://jestjs.io/)
- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest API Testing](https://github.com/visionmedia/supertest)

---

**Creado:** 2 de abril de 2026
**Última actualización:** 2 de abril de 2026
