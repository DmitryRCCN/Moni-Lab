export type MinigameFeedback = {
  puntos: number
  msg: string
}

export type MinigameConfig = PickNConfig | SequentialDecisionConfig | SavingsPathConfig | CategorizeConfig

export type PickNConfig = {
  tipo: 'PICK_N'
  cantidad_requerida: number
  elementos: Array<{
    id: string
    nombre: string
    es_correcto: boolean
    img?: string
  }>
}

export type SequentialDecisionConfig = {
  tipo: 'SEQUENTIAL_DECISION'
  pasos: Array<{
    pregunta: string
    respuesta_correcta: 'si' | 'no'
    contexto?: string
  }>
}

export type SavingsPathConfig = {
  tipo: 'SAVINGS_PATH'
  meta: number
  inicial: number
  pasos: Array<{
    dia: string
    pregunta: string
    opciones: Array<{
      txt: string
      valor: number
      es_correcto: boolean
    }>
  }>
}

export type CategorizeConfig = {
  tipo: 'CATEGORIZE'
  categorias: string[]
  items: Array<{
    nombre: string
    correcta: string
  }>
}
