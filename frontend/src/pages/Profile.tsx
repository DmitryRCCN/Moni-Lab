export default function Profile() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Mi Perfil</h1>
      
      <div className="bg-white p-6 rounded shadow max-w-md">
        {/* Avatar y datos básicos */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold">Nombre Usuario</h2>
          <p className="text-gray-600">niño@ejemplo.com</p>
        </div>
        
        {/* Estadísticas */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span>Monedas:</span>
            <span className="font-bold">150</span>
          </div>
          <div className="flex justify-between">
            <span>Puntos:</span>
            <span className="font-bold">450</span>
          </div>
          <div className="flex justify-between">
            <span>Emblemas:</span>
            <span className="font-bold">5</span>
          </div>
        </div>
        
        {/* Botones de acción */}
        <button className="w-full p-2 bg-blue-500 text-white rounded mb-2">Editar Perfil</button>
        <button className="w-full p-2 bg-red-500 text-white rounded">Cerrar Sesión</button>
      </div>
    </div>
  )
}
