import LearningPath from '../components/LearningPath'
import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

type Nodo = { id_nodo: string; titulo: string; descripcion?: string }

export default function Path() {
  const [nodos, setNodos] = useState<any[] | null>(null)
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)  
  // DECLARACIÓN DEL ESTADO QUE FALTABA:
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null) 
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const [progressMap, setProgressMap] = useState<Record<string, string>>({})

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await api('/nodos')
        const currentNodos = res || []
        if (mounted) setNodos(currentNodos)

        // Si hay usuario autenticado, cargar su progreso
        if (user) {
          try {
            const p = await api(`/usuario/${user.id}/progreso`);
            const map: Record<string, string> = {};

            const rows = Array.isArray(p) ? p : (p?.progreso || []);

            rows.forEach((row: any) => {
              const id = row.id_actividad || row.actividad_id;
              const estado = row.estado || row.estado_actividad || 'disponible';
              if (id) map[id] = estado;
            });
            
            if (mounted) {
              setProgressMap(map);
              
              // --- LÓGICA PARA ENCONTRAR EL PUNTO DE ENFOQUE ---
              const sorted = [...currentNodos].sort((a, b) => a.orden_secuencial - b.orden_secuencial)
              let targetNodeId = null;
              let targetActivityId = null;

              // 1. Buscamos el ÚLTIMO nodo que tenga al menos una actividad 'disponible'
              const lastAvailableNode = [...sorted].reverse().find(node => 
                node.activities?.some((act: any) => map[act.id_actividad] === 'disponible')
              );
              
              if (lastAvailableNode) {
                targetNodeId = lastAvailableNode.id_nodo;
                // Buscamos la ÚLTIMA actividad 'disponible' dentro de ese nodo
                const lastAct = [...lastAvailableNode.activities]
                  .reverse()
                  .find((act: any) => map[act.id_actividad] === 'disponible');
                targetActivityId = lastAct?.id_actividad;
              } else {
                // 2. Si no hay disponibles, buscamos el ÚLTIMO nodo 'completado'
                const lastCompletedNode = [...sorted].reverse().find(node => 
                  node.activities?.some((act: any) => map[act.id_actividad] === 'completada')
                );
                
                if (lastCompletedNode) {
                  targetNodeId = lastCompletedNode.id_nodo;
                  const lastAct = [...lastCompletedNode.activities]
                    .reverse()
                    .find((act: any) => map[act.id_actividad] === 'completada');
                  targetActivityId = lastAct?.id_actividad;
                }
              }
              
              // Seteamos los IDs para que el hijo (LearningPath) haga su magia
              setActiveNodeId(targetNodeId || (sorted.length > 0 ? sorted[0].id_nodo : null));
              setActiveActivityId(targetActivityId);
            }
          } catch (e) {
            console.error("Error cargando progreso:", e);
          }
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Error cargando nodos')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

  return (
    <div className="min-h-screen">
      <div className="animate-in fade-in duration-500">
        <div className="moni-panel p-6 mb-6">
          <h1 className="text-3xl font-bold text-yellow-400 mb-3">Ruta de aprendizaje</h1>
          <p className="text-white/80 text-sm sm:text-base">Sigue el camino para dominar la educación financiera 💰</p>
        </div>

        <div className="moni-panel p-6 mb-6">
          {loading ? (
            <p className="text-white text-center">Cargando ruta...</p>
          ) : error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : (
            <LearningPath
              nodes={nodos || undefined}
              progress={progressMap}
              activeNodeId={activeNodeId}
              activeActivityId={activeActivityId}
            />
          )}
        </div>
      </div>
    </div>
  )
}