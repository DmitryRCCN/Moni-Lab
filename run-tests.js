#!/usr/bin/env node

/**
 * Test Runner Script - Moni-Lab
 * Ejecuta pruebas de forma sencilla con diferentes opciones
 * 
 * Uso:
 *   node run-tests.js [opción]
 * 
 * Opciones:
 *   all        - Todas las pruebas
 *   backend    - Solo backend
 *   frontend   - Solo frontend
 *   unit       - Solo unitarias
 *   integration - Solo integración
 *   coverage   - Con reporte de cobertura
 *   watch      - Modo watch
 */

const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || 'all';

const commands = {
  all: () => {
    console.log('🧪 Ejecutando TODAS las pruebas...\n');
    runCommand('pnpm test');
  },
  
  backend: () => {
    console.log('🔧 Ejecutando pruebas de BACKEND...\n');
    runCommand('pnpm --filter moni-lab-backend test');
  },
  
  frontend: () => {
    console.log('🎨 Ejecutando pruebas de FRONTEND...\n');
    runCommand('pnpm --filter frontend test');
  },
  
  unit: () => {
    console.log('📦 Ejecutando pruebas UNITARIAS...\n');
    runCommand('pnpm --filter moni-lab-backend test:unit');
  },
  
  integration: () => {
    console.log('🔗 Ejecutando pruebas de INTEGRACIÓN...\n');
    runCommand('pnpm --filter moni-lab-backend test:integration');
  },
  
  coverage: () => {
    console.log('📊 Generando COBERTURA...\n');
    runCommand('pnpm test:coverage');
  },
  
  watch: () => {
    console.log('👁️  Modo WATCH (presiona q para salir)...\n');
    const which = args[1] || 'backend';
    if (which === 'backend') {
      runCommand('pnpm --filter moni-lab-backend test:watch');
    } else if (which === 'frontend') {
      runCommand('pnpm --filter frontend test:watch');
    } else {
      runCommand('pnpm -r test:watch');
    }
  },
  
  help: () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║              MONI-LAB TEST RUNNER                         ║
╚═══════════════════════════════════════════════════════════╝

📋 Opciones disponibles:

  node run-tests.js all          Todas las pruebas
  node run-tests.js backend      Solo backend
  node run-tests.js frontend     Solo frontend
  node run-tests.js unit         Solo unitarias (backend)
  node run-tests.js integration  Solo integración (backend)
  node run-tests.js coverage     Cobertura de código
  node run-tests.js watch [backend|frontend]  Modo watch
  node run-tests.js help         Esta ayuda

📚 Ejemplos:

  # Todos los tests
  node run-tests.js all

  # Backend en watch
  node run-tests.js watch backend

  # Frontend con cobertura
  node run-tests.js coverage

  # Verificar integridad ML
  node run-tests.js integration

    `);
  }
};

function runCommand(cmd) {
  try {
    console.log(`\n📍 Ejecutando: ${cmd}\n`);
    execSync(cmd, { stdio: 'inherit' });
    console.log('\n✅ ¡Pruebas completadas!\n');
  } catch (error) {
    console.error('\n❌ Error al ejecutar pruebas\n');
    process.exit(1);
  }
}

// Ejecutar comando
if (commands[command]) {
  commands[command]();
} else {
  console.log(`❌ Opción desconocida: ${command}\n`);
  commands.help();
  process.exit(1);
}
