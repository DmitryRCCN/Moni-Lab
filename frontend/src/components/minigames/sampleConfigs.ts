import type { MinigameConfig, MinigameFeedback } from './types'

export const metaGranAhorroConfig: MinigameConfig = {
  tipo: 'SEQUENTIAL_CHOICE',
  titulo: 'La meta del gran ahorro',
  descripcion:
    'Tienes una alcancía y quieres ahorrar para comprar una bicicleta. Decide sabiamente en cada situación.',
  pasos: [
    {
      id: 'dia1',
      etiqueta: 'Día 1',
      pregunta: 'Tu familiar te da $10. También ves un dulce que cuesta $5. ¿Qué haces?',
      opciones: [
        { id: 'comprar-dulce', label: 'Comprar el dulce', correcto: false },
        { id: 'guardar', label: 'Guardar todo en la alcancía', correcto: true },
      ],
    },
    {
      id: 'dia2',
      etiqueta: 'Día 2',
      pregunta: 'Un amigo quiere venderte un juguete por $8. ¿Qué haces?',
      opciones: [
        { id: 'comprar-juguete', label: 'Comprar el juguete', correcto: false },
        { id: 'seguir-ahorrando', label: 'Seguir ahorrando para tu meta', correcto: true },
      ],
    },
    {
      id: 'dia3',
      etiqueta: 'Día 3',
      pregunta: 'Te dan $10 más para tu alcancía. También ves frituras que cuestan $15. ¿Qué haces?',
      opciones: [
        { id: 'comprar-frituras', label: 'Comprar las frituras', correcto: false },
        { id: 'guardar-mas', label: 'Guardar el dinero para tu meta', correcto: true },
      ],
    },
    {
      id: 'dia4',
      etiqueta: 'Día 4',
      pregunta: 'Ves un pastel de $20. ¿Qué haces?',
      opciones: [
        { id: 'comprar-pastel', label: 'Comprar el pastel', correcto: false },
        { id: 'guardar-pasta', label: 'Guardar el dinero', correcto: true },
      ],
    },
    {
      id: 'dia5',
      etiqueta: 'Día 5',
      pregunta: 'Tu mamá te da $10 por hacer tus deberes. Ves un cómic de $15. ¿Qué haces?',
      opciones: [
        { id: 'comprar-comic', label: 'Comprar el cómic', correcto: false },
        { id: 'no-comprar-comic', label: 'No comprarlo', correcto: true },
      ],
    },
  ],
}

export const metaGranAhorroFeedback: MinigameFeedback[] = [
  {
    minScore: 0,
    maxScore: 2,
    message: 'Qué mal, no pudiste llegar a la meta. Intenta elegir mejor tus gastos.',
  },
  {
    minScore: 3,
    maxScore: 4,
    message:
      'Casi llegas: tu ahorro creció, pero hubo decisiones que te alejaron de la bicicleta. ¡Intenta de nuevo!',
  },
  {
    minScore: 5,
    maxScore: 5,
    message: '¡Felicidades! Has conseguido ahorrar lo suficiente para comprar una bicicleta nueva.',
  },
]
