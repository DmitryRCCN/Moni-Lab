export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a Moni-Lab</h1>
      <p className="text-lg text-gray-600 mb-8">Aprende economía jugando</p>
      
      {/* Aquí irán botones de navegación, cards de lecciones, etc. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-100 rounded">Lección 1</div>
        <div className="p-4 bg-green-100 rounded">Lección 2</div>
      </div>
    </div>
  )
}
