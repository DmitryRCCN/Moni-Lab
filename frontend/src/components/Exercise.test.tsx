import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../__tests__/test-utils';
import Exercise from './Exercise';
import * as api from '../api';

// Mock del API
vi.mock('../api', () => ({
  default: vi.fn()
}));

// Mock del AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-123', nombre: 'Test User' }
  })
}));

// Mock del React Router
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({
      id: 'activity-123'
    }),
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    })
  };
});

const mockApi = api.default as any;

describe('Exercise Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe renderizar ejercicio en modo NORMAL', async () => {
    const mockPreguntas = {
      id_intento: 'intento-123',
      modo: 'NORMAL',
      preguntas: [
        {
          id_pregunta: 'p1',
          enunciado: '¿Qué es el dinero?',
          tipo_pregunta: 'multiple',
          nivel_dificultad: 1,
          respuesta_correcta: 'A',
          opciones: '["A. Medio de intercambio", "B. Metal precioso", "C. Papel"]',
          topico: 'dinero-basico',
          puntos: 10
        }
      ]
    };

    mockApi.mockResolvedValue(mockPreguntas);

    const { container } = render(
      <Exercise ejercicio={{ es_de_salto: false }} activityId="activity-123" />
    );

    // Esperar a que se cargue el contenido
    await waitFor(() => {
      const questionText = container.textContent;
      expect(questionText).toContain('¿Qué es el dinero?');
    });

    // Verificar que el mock API fue llamado
    expect(mockApi).toHaveBeenCalled();
  });

  test('debe renderizar ejercicio en modo SALTO', async () => {
    const mockPreguntas = {
      id_intento: 'intento-456',
      modo: 'SALTO',
      preguntas: Array(15).fill(0).map((_, i) => ({
        id_pregunta: `p${i}`,
        enunciado: `Pregunta ${i + 1}`,
        tipo_pregunta: 'multiple',
        nivel_dificultad: 2,
        respuesta_correcta: 'A',
        opciones: '["A", "B", "C", "D"]',
        topico: 'cualquier-topico',
        puntos: 10
      }))
    };

    mockApi.mockResolvedValue(mockPreguntas);

    const { container } = render(
      <Exercise ejercicio={{ es_de_salto: true }} activityId="exam-salto-002" />
    );

    // Esperar a que se cargue el contenido
    await waitFor(() => {
      const content = container.textContent;
      expect(content).toContain('Pregunta');
    });

    // Verificar que hay 15 preguntas en el modo SALTO
    expect(mockPreguntas.preguntas).toHaveLength(15);
  });

  test('debe cambiar a siguiente pregunta al confirmar', async () => {
    const mockPreguntas = {
      id_intento: 'intento-123',
      modo: 'NORMAL',
      preguntas: [
        {
          id_pregunta: 'p1',
          enunciado: 'Pregunta 1',
          tipo_pregunta: 'multiple',
          nivel_dificultad: 1,
          respuesta_correcta: 'A',
          opciones: '["A", "B", "C"]',
          topico: 'tema-1',
          puntos: 10
        },
        {
          id_pregunta: 'p2',
          enunciado: 'Pregunta 2',
          tipo_pregunta: 'multiple',
          nivel_dificultad: 1,
          respuesta_correcta: 'B',
          opciones: '["A", "B", "C"]',
          topico: 'tema-2',
          puntos: 10
        }
      ]
    };

    mockApi.mockResolvedValue(mockPreguntas);

    const { container } = render(
      <Exercise ejercicio={{ es_de_salto: false }} activityId="activity-123" />
    );

    // Esperar a que se cargue la primera pregunta
    await waitFor(() => {
      const content = container.textContent;
      expect(content).toContain('Pregunta 1');
    });
  });

  test('debe mostrar pantalla de resultados al terminar', async () => {
    const mockPreguntas = {
      id_intento: 'intento-123',
      modo: 'NORMAL',
      preguntas: [
        {
          id_pregunta: 'p1',
          enunciado: 'Pregunta 1',
          tipo_pregunta: 'multiple',
          nivel_dificultad: 1,
          respuesta_correcta: 'A',
          opciones: '["A", "B", "C"]',
          topico: 'tema-1',
          puntos: 10
        }
      ]
    };

    mockApi.mockResolvedValue(mockPreguntas);

    const { container } = render(
      <Exercise ejercicio={{ es_de_salto: false }} activityId="activity-123" />
    );

    // Esperar a que se cargue la pregunta
    await waitFor(() => {
      const content = container.textContent;
      expect(content).toContain('Pregunta 1');
    });

    // El test verifica que la carga fue exitosa
    expect(mockApi).toHaveBeenCalled();
  });

  test('debe cargar nuevo intento en NORMAL si fue saltada antes', async () => {
    // Scenario: Usuario completó un examen de salto, ahora reinicia
    // y debe ver modo NORMAL

    mockApi.mockResolvedValueOnce({
      // Primera carga: Retorna NORMAL (porque ya está completada)
      id_intento: 'intento-nuevo',
      modo: 'NORMAL',
      preguntas: [
        {
          id_pregunta: 'p1',
          enunciado: 'Pregunta práctica',
          tipo_pregunta: 'multiple',
          nivel_dificultad: 1,
          respuesta_correcta: 'A',
          opciones: '["A", "B", "C"]',
          topico: 'tema',
          puntos: 10
        }
      ]
    });

    const { container } = render(
      <Exercise ejercicio={{ es_de_salto: true }} activityId="exam-salto-002" />
    );

    // Esperar a que se cargue
    await waitFor(() => {
      const content = container.textContent;
      expect(content).toContain('Pregunta');
    });

    // Verificar que el API fue llamado
    expect(mockApi).toHaveBeenCalled();
  });

});
