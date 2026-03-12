import { useEffect, useState } from 'react';
import api from '../api';
import Avatar from './avatar';

type EquipModalProps = {
  onClose: () => void;
  // onAvatarUpdate avisa al Perfil para que actualice la imagen grande sin recargar
  onAvatarUpdate?: (item: any) => void; 
};

export default function EquipModal({ onClose, onAvatarUpdate }: EquipModalProps) {
  const [items, setItems] = useState<any[]>([]);
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());
  const [equippedIds, setEquippedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [itemsRes, profileRes] = await Promise.all([api('/items'), api('/usuario/me')]);
        if (!mounted) return;
        
        setItems(itemsRes || []);
        const userData = profileRes?.user || profileRes;
        
        const purchased = userData?.items_comprados || [];
        setOwnedIds(new Set(purchased.map((i: any) => String(i.id_item))));
        
        // Función para detectar qué está equipado
        const equipped = purchased
          .filter((i: any) => i.equipado === true || i.equipado === 1 || String(i.equipado) === 'true' || String(i.equipado) === '1')
          .map((i: any) => String(i.id_item));
        
        setEquippedIds(new Set(equipped));
      } catch (err) {
        console.error("Error al cargar datos del modal", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  const handleEquip = async (item: any) => {
    // Si ya está equipado, no hacemos nada    
    if (equippedIds.has(String(item.id_item))) return;
    
    try {
      // 1. Llamada a la API  
      await api(`/items/${item.id_item}/equipar`, { method: 'POST' });
      
      // 2. Actualización optimista del estado local del Modal
      setEquippedIds(prev => {
        const next = new Set(Array.from(prev));
        
        // Buscamos ítems del mismo tipo en la lista general para desequiparlos visualmente
        const sameCategoryItems = items
            .filter(it => it.tipo === item.tipo)
            .map(it => String(it.id_item));
        
        sameCategoryItems.forEach(id => next.delete(id));
        
        // Equipamos el nuevo
        next.add(String(item.id_item));
        return next;
      });
      
      if (onAvatarUpdate) onAvatarUpdate(item);
      
      setNotification({ msg: `Equipado: ${item.nombre}`, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification({ msg: 'No se pudo equipar', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      
      {notification && (
        <div className="fixed top-20 right-4 z-[60] animate-in slide-in-from-right-full duration-300">
          <div className={`px-6 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-emerald-900/90 border-emerald-500 text-emerald-200' 
              : 'bg-red-900/90 border-red-500 text-red-200'
          }`}>
            <span className="text-xl">{notification.type === 'success' ? '✅' : '❌'}</span>
            <p className="font-medium">{notification.msg}</p>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between mb-4 shrink-0 border-b border-white/10 pb-4">
          <h3 className="text-2xl font-bold text-white">Editar avatar</h3>
          <button onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-red-500/80 transition-colors text-white rounded-lg font-bold">
            Cerrar
          </button>
        </div>

        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white">Revisando tu armario...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {items.filter(it => ownedIds.has(String(it.id_item))).length === 0 && (
                <div className="col-span-full text-center py-10 text-white/40 italic">
                  No tienes ítems en tu inventario.
                </div>
              )}

              {items.filter(it => ownedIds.has(String(it.id_item))).map(it => {
                const isEquipped = equippedIds.has(String(it.id_item));

                return (
                  <div key={it.id_item} className={`p-4 rounded-xl flex flex-col items-center border transition-all ${isEquipped ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/5'}`}>
                    <div className="w-24 h-24 mb-2">
                      <Avatar equipped={{ [it.tipo]: { id: it.id_item, svg: it.svg_capa }, base: { id: 'base_peach' } } as any} className="w-full h-full" />
                    </div>
                    <div className="font-bold text-center text-white">{it.nombre}</div>
                    <div className="text-xs text-white/40 uppercase mb-3">{it.tipo}</div>
                    
                    <button
                      onClick={() => handleEquip(it)}
                      disabled={isEquipped}
                      className={`w-full py-2 rounded-lg font-bold transition-all ${
                        isEquipped 
                          ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-lg'
                      }`}
                    >
                      {isEquipped ? 'Equipado' : 'Equipar'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}