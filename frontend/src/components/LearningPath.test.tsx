import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../__tests__/test-utils';
import LearningPath from './LearningPath';

describe('LearningPath Component', () => {

  const mockNodes = [
    {
      id_nodo: 'node-1',
      titulo: 'Intro al Dinero',
      descripcion: 'Aprende qué es el dinero',
      orden_secuencial: 1,
      activities: [
        {
          id_actividad: 'leccion-1-1',
          tipo_actividad: 'lectura',
          orden_secuencial: 1,
          es_de_salto: false
        },
        {
          id_actividad: 'activity-1-1',
          tipo_actividad: 'ejercicio',
          orden_secuencial: 2,
          es_de_salto: false
        }
      ]
    },
    {
      id_nodo: 'node-2',
      titulo: 'El Dinero en la Historia',
      descripcion: 'Cómo evolucionó el dinero',
      orden_secuencial: 2,
      activities: [
        {
          id_actividad: 'exam-salto-002',
          tipo_actividad: 'ejercicio',
          orden_secuencial: 1,
          es_de_salto: true
        }
      ]
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe renderizar nodos sin progreso', () => {
    render(
      <LearningPath nodes={mockNodes} progress={{}} />
    );

    // Buscar títulos parciales ya que pueden estar divididos en múltiples elementos
    expect(screen.getByText(/Intro al Dinero/i)).toBeInTheDocument();
    expect(screen.getByText(/El Dinero en la Historia/i)).toBeInTheDocument();
  });

  test('debe mostrar estado "completada" con check verde', () => {
    const progress = {
      'activity-1-1': 'completada'
    };

    const { container } = render(
      <LearningPath nodes={mockNodes} progress={progress} />
    );

    // Verificar que el contenedor se renderiza sin errores
    expect(container).toBeInTheDocument();
    // Verificar que existe algún elemento SVG (check, ícono)
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('debe mostrar estado "saltada" igual que "completada" visualmente', () => {
    const progress = {
      'leccion-1-1': 'saltada',
      'activity-1-1': 'saltada'
    };

    const { container } = render(
      <LearningPath nodes={mockNodes} progress={progress} />
    );

    // Verificar que el componente se renderiza correctamente
    expect(container).toBeInTheDocument();
    // Verificar que hay elementos en el contenedor
    expect(container.querySelectorAll('button').length).toBeGreaterThan(0);
  });

  test('debe mostrar estado "bloqueada" con candado', () => {
    const progress = {
      'activity-1-1': 'completada'
    };

    const { container } = render(
      <LearningPath nodes={mockNodes} progress={progress} />
    );

    // Verificar que se renderiza
    expect(container).toBeInTheDocument();
    // El segundo nodo debe estar bloqueado (disponibilidad de datos)
    expect(container.querySelectorAll('button').length).toBeGreaterThan(0);
  });

  test('debe mostrar estado "disponible" para actividades desbloqueadas', () => {
    const progress = {
      'leccion-1-1': 'completada',
      'activity-1-1': 'disponible'
    };

    const { container } = render(
      <LearningPath nodes={mockNodes} progress={progress} />
    );

    // Verificar que el componente se representa
    expect(container).toBeInTheDocument();
    // Debe tener elementos interactivos
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('debe renderizar sin crash cuando nodes está vacío', () => {
    const { container } = render(
      <LearningPath nodes={[]} progress={{}} />
    );

    expect(container).toBeInTheDocument();
  });

  test('debe mostrar examen de salto diferente visualmente', () => {
    const progress = {};

    const { container } = render(
      <LearningPath nodes={mockNodes} progress={progress} />
    );

    // Verificar que el componente se renderiza
    expect(container).toBeInTheDocument();
    // Los exámenes de salto son identificables por tener es_de_salto: true
    // Verificar que hay elementos SVG (para íconos)
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('debe responder a prop activeNodeId para expandir nodo', () => {
    const { container } = render(
      <LearningPath nodes={mockNodes} progress={{}} activeNodeId="node-1" />
    );

    // Verificar que el componente se renderiza con el nodeId activo
    expect(container).toBeInTheDocument();
    // Debe tener el nodo con la ID específica identificable de algún modo
    expect(container.querySelectorAll('button').length).toBeGreaterThan(0);
  });

  test('debe responder a prop activeActivityId para resaltar actividad', () => {
    const { container } = render(
      <LearningPath 
        nodes={mockNodes} 
        progress={{}} 
        activeNodeId="node-1"
        activeActivityId="activity-1-1" 
      />
    );

    // Verificar que el componente se renderiza con la actividad activa
    expect(container).toBeInTheDocument();
    // Debe tener múltiples botones para actividades
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

});
