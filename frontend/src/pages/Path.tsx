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
          <p className="text-white/80 text-sm sm:text-base flex items-center justify-center md:justify-start gap-2">
            <span>Sigue el camino para dominar la educación financiera</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" 
              />
            </svg>
          </p>
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