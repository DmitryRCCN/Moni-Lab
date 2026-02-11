import { useParams } from 'react-router-dom'

export default function Lesson() {
  const { id } = useParams()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Lección {id}</h1>
      
      {/* Contenido de la lección */}
      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-700 mb-4">Contenido de la lección aquí</p>
        
        {/* Pregunta/Quiz */}
        <div className="mt-6 p-4 bg-yellow-50 rounded">
          <h2 className="font-bold mb-3">Pregunta:</h2>
          <div className="space-y-2">
            <button className="w-full p-2 bg-blue-200 rounded hover:bg-blue-300">Opción A</button>
            <button className="w-full p-2 bg-blue-200 rounded hover:bg-blue-300">Opción B</button>
            <button className="w-full p-2 bg-blue-200 rounded hover:bg-blue-300">Opción C</button>
          </div>
        </div>
      </div>
    </div>
  )
}
