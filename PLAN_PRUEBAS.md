# Plan de Pruebas - Moni-Lab

## 📋 Resumen Ejecutivo
Este documento describe el plan de pruebas para la aplicación Moni-Lab. Incluye pruebas unitarias, de integración y funcionales con comandos simples para ejecutar.

---

## 🎯 Objetivos de Testing

| Objetivo | Descripción |
|----------|-------------|
| **Confiabilidad** | Validar que el core del negocio funciona correctamente |
| **Regresión** | Detectar problemas causados por cambios futuros |
| **Documentación** | Mantener ejemplos de cómo se usa el código |
| **ML Integrity** | Evitar datos falsos/fictivos en el módulo de ML |

---

## 🏗️ Estrategia de Pruebas

### 1. **PRUEBAS UNITARIAS** 
Pruebas de funciones individuales sin dependencias externas.

**Backend:**
```bash
# Ejecutar pruebas unitarias del backend
cd backend && pnpm test

# Ejecutar pruebas en modo watch
cd backend && pnpm test:watch

# Pruebas de un archivo específico
cd backend && pnpm test actividad.service.test.ts
```

**Frontend:**
```bash
# Ejecutar pruebas unitarias del frontend
cd frontend && pnpm test

# Modo watch
cd frontend && pnpm test:watch
```

---

### 2. **PRUEBAS DE INTEGRACIÓN**
Pruebas que validan múltiples componentes trabajando juntos (Ej: API endpoints)

**Backend API Tests:**
```bash
cd backend && pnpm test:integration
```

**Casos cubiertos:**
- ✅ Autenticación (login/register)
- ✅ Obtención de nodos y actividades
- ✅ Generación de intento con modo correcto
- ✅ Actualización de progreso
- ✅ Validación de estado "saltada" vs "completada"

---

### 3. **PRUEBAS FUNCIONALES (E2E)**
Pruebas que simulan interacciones del usuario real.

```bash
# Iniciar frontend y backend
cd Moni-Lab && pnpm dev:all

# En otra terminal
cd frontend && pnpm test:e2e
```

**Flujos probados:**
1. 🔐 Login → Home → Path (Ruta de aprendizaje)
2. 📚 Seleccionar nodo → Ver actividades
3. ✏️ Acceder a ejercicio normal
4. ⚡ Acceder a ejercicio de salto (sin completar anteriores)
5. ✅ Completar salto → Ver modo normal en reintentos
6. 🎯 Validar progreso se actualiza correctamente

---

## 🚀 Cómo Ejecutar (Guía Rápida)

### Opción 1️⃣: Pruebas Rápidas (Solo Backend)
```bash
cd backend
pnpm install
pnpm test
```

### Opción 2️⃣: Pruebas Completas (Backend + Frontend)
```bash
# Terminal 1: Backend
cd Moni-Lab/backend
pnpm dev

# Terminal 2: Frontend
cd Moni-Lab/frontend
pnpm dev

# Terminal 3: Ejecutar pruebas
cd Moni-Lab/backend && pnpm test
cd Moni-Lab/frontend && pnpm test
```

### Opción 3️⃣: Pruebas E2E (Usando la app en vivo)
```bash
# Prerequisito: Tener backend + frontend corriendo (ver Opción 2)
cd Moni-Lab/frontend
pnpm test:e2e
```

---

## 📁 Estructura de Archivos de Prueba

```
backend/
├── src/
│   └── modules/
│       └── actividad/
│           ├── actividad.service.ts
│           └── actividad.service.test.ts    ← Pruebas
├── tests/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── actividad.test.ts
│   │   └── nodo.test.ts
│   └── fixtures/                            ← Datos mock
│       └── testData.ts

frontend/
├── src/
│   ├── components/
│   │   ├── Exercise.tsx
│   │   └── Exercise.test.tsx               ← Pruebas
│   └── pages/
│       ├── Path.tsx
│       └── Path.test.tsx                   ← Pruebas
├── tests/
│   └── e2e/
│       ├── auth.e2e.test.ts
│       ├── learning-path.e2e.test.ts
│       └── exercise-flow.e2e.test.ts
```

---

## ✅ Casos de Prueba Clave

### Backend - Actividad Service

| Test | Descripción | Resultado Esperado |
|------|-------------|-------------------|
| `getOrCreateIntento_normal` | Crear intento para ejercicio normal | `modo = 'NORMAL'` |
| `getOrCreateIntento_salto_nuevo` | Crear intento de salto sin completar previas | `modo = 'SALTO'`, 15 preguntas |
| `getOrCreateIntento_salto_completado` | Crear intento después de completar salto | `modo = 'NORMAL'`, preguntas normales |
| `hasCompletedPreviousActivities_true` | Usuario completó todas las previas | Retorna `true` |
| `hasCompletedPreviousActivities_false` | Usuario NO completó todas | Retorna `false` |
| `updateIntentoFinal_success` | Actualizar intento con puntaje | Progreso marcado en BD |

### Frontend - Exercise Component

| Test | Descripción | Resultado Esperado |
|------|-------------|-------------------|
| `render_exercise_normal` | Mostrar ejercicio normal | Badge "Modo Normal ✏️" visible |
| `render_exercise_salto` | Mostrar ejercicio de salto | Badge "Reto de Salto ⚡" visible |
| `select_option_and_confirm` | Usuario selecciona respuesta | Siguiente pregunta se carga |
| `show_results_after_completion` | Mostrar pantalla de resultados | Score, monedas y botón siguiente |

### Frontend - LearningPath Component

| Test | Descripción | Resultado Esperado |
|------|-------------|-------------------|
| `render_nodes_with_progress` | Mostrar nodos con progreso | Estados visuales correctos (✅ completada, ⚡ saltada, 🔒 bloqueada) |
| `show_saltada_as_completed` | Estado "saltada" se ve igual que "completada" | Check verde + color dorado |

---

## 🔍 Validaciones ML (Muy Importante)

Estas pruebas validan que NO estamos creando datos falsificados:

```typescript
// ❌ MAL: Estado completada con 100 ficticio
progreso_actividad: { estado: 'completada', puntaje: 100 } // ← RUIDO PARA ML

// ✅ BIEN: Estado saltada para actividades NO realizadas
progreso_actividad: { estado: 'saltada', puntaje: NULL } // ← ML ignora esto
```

**Prueba de validación:**
```bash
# Verificar que actividades saltadas se filten en queries
backend/tests/integration/ml-integrity.test.ts
```

---

## 📊 Cobertura de Código Goal

| Módulo | Target |
|--------|--------|
| actividad.service.ts | 85%+ |
| auth.service.ts | 80%+ |
| nodo.service.ts | 75%+ |
| Exercise.tsx | 70%+ |
| LearningPath.tsx | 70%+ |

Ejecutar:
```bash
cd backend && pnpm test:coverage
cd frontend && pnpm test:coverage
```

---

## 🛠️ Troubleshooting

### Error: "Cannot find module @libsql/client"
```bash
cd backend && pnpm install
```

### Tests no encuentran fixtures
```bash
# Asegurar ruta correcta en tests
import { testData } from '../fixtures/testData';
```

### Frontend test timeout
```bash
# Aumentar timeout en vitest.config.ts
defineConfig({
  test: {
    testTimeout: 10000
  }
})
```

---

## 📝 Ejecutar Pruebas en CI/CD

Agregar a `.github/workflows/tests.yml`:

```yaml
name: Run Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install deps
        run: pnpm install
      
      - name: Backend tests
        run: cd backend && pnpm test
      
      - name: Frontend tests
        run: cd frontend && pnpm test
```

---

## 📚 Referencias

- [Jest Docs](https://jestjs.io/)
- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest for API testing](https://github.com/visionmedia/supertest)

---

**Última actualización:** 2 de abril de 2026
