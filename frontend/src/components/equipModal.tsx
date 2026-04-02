import { useEffect, useState, useMemo } from 'react';
import api from '../api';
import Avatar, { type AvatarEquipped } from './avatar';
import { useAuth } from '../context/AuthContext';

const ICONS = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-emerald-400">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-400">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
    </svg>
  ),
};

// Tipos para etiquetas de categoría en español
const TIPO_LABELS: Record<string, string> = {
  background: 'Fondo',
  clothing:   'Ropa',
  base:       'Piel',
  eyes:       'Ojos',
  accessory:  'Accesorio',
  hair:       'Cabello',
};

type EquipModalProps = {
  onClose: () => void;
  onAvatarUpdate?: (item: any) => void;
};

export default function EquipModal({ onClose, onAvatarUpdate }: EquipModalProps) {
  const { user, updateUserData } = useAuth();

  const [items, setItems]           = useState<any[]>([]);
  const [ownedIds, setOwnedIds]     = useState<Set<string>>(new Set());
  const [equippedIds, setEquippedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading]       = useState(true);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Estado local del equipped para que la preview se actualice al equipar
  const [localEquipped, setLocalEquipped] = useState<AvatarEquipped>({});

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [itemsRes, profileRes] = await Promise.all([api('/items'), api('/usuario/me')]);
        if (!mounted) return;

        const allItems   = itemsRes || [];
        const userData   = profileRes?.user || profileRes;
        const purchased  = userData?.items_comprados || [];

        setItems(allItems);
        setOwnedIds(new Set(purchased.map((i: any) => String(i.id_item))));

        // IDs equipados
        const equipped = purchased
          .filter((i: any) =>
            i.equipado === true || i.equipado === 1 ||
            String(i.equipado) === 'true' || String(i.equipado) === '1'
          )
          .map((i: any) => String(i.id_item));
        setEquippedIds(new Set(equipped));

        // Construir el objeto equipped completo con SVGs para la preview
        const equippedObj: AvatarEquipped = { ...user?.equipped };
        purchased.forEach((pi: any) => {
          const isEq =
            pi.equipado === true || pi.equipado === 1 ||
            String(pi.equipado) === 'true' || String(pi.equipado) === '1';
          if (isEq) {
            const def = allItems.find((it: any) => String(it.id_item) === String(pi.id_item));
            if (def) {
              (equippedObj as any)[def.tipo] = { id: def.id_item, svg: def.svg_capa };
            }
          }
        });

        // Garantizar que siempre haya un mono base en la preview
        // aunque el usuario no haya comprado/equipado ninguno explícitamente
        if (!equippedObj.base?.svg) {
          const fallbackBase = allItems.find((it: any) => it.tipo === 'base');
          if (fallbackBase) {
            equippedObj.base = { id: fallbackBase.id_item, svg: fallbackBase.svg_capa };
          }
        }

        setLocalEquipped(equippedObj);
      } catch (err) {
        console.error('Error al cargar datos del modal', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  // ── Preview del avatar con el item aplicado temporalmente ────────────────
  // Fusiona el equipped actual con el item que se está inspeccionando,
  // de modo que el usuario ve exactamente cómo quedaría el avatar completo.
  const buildPreview = useMemo(() => {
    return (item: any): AvatarEquipped => ({
      ...localEquipped,
      [item.tipo]: { id: item.id_item, svg: item.svg_capa },
    });
  }, [localEquipped]);

  // ── Equipar ───────────────────────────────────────────────────────────────
  const handleEquip = async (item: any) => {
    if (equippedIds.has(String(item.id_item))) return;

    try {
      await api(`/items/${item.id_item}/equipar`, { method: 'POST' });

      const newEquipped: AvatarEquipped = {
        ...user?.equipped,
        [item.tipo]: { id: item.id_item, svg: item.svg_capa },
      };
      updateUserData({ equipped: newEquipped });

      // Actualizar estado local de equipped para que el resto de previews también cambien
      setLocalEquipped(prev => ({
        ...prev,
        [item.tipo]: { id: item.id_item, svg: item.svg_capa },
      }));

      setEquippedIds(prev => {
        const next = new Set(Array.from(prev));
        items
          .filter(it => it.tipo === item.tipo)
          .forEach(it => next.delete(String(it.id_item)));
        next.add(String(item.id_item));
        return next;
      });

      if (onAvatarUpdate) onAvatarUpdate(item);
      setNotification({ msg: `Equipado: ${item.nombre}`, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch {
      setNotification({ msg: 'No se pudo equipar', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Ítems que el usuario posee, agrupados por tipo
  const ownedItems = useMemo(
    () => items.filter(it => ownedIds.has(String(it.id_item))),
    [items, ownedIds]
  );

  const categories = useMemo<string[]>(
    () => Array.from(new Set(ownedItems.map(it => it.tipo))),
    [ownedItems]
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">

      {/* Notificación flotante */}
      {notification && (
        <div className="fixed top-20 right-4 z-[60] animate-in slide-in-from-right-full duration-300">
          <div className={`px-6 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-500 text-emerald-200'
              : 'bg-red-900/90 border-red-500 text-red-200'
          }`}>
            {notification.type === 'success' ? ICONS.success : ICONS.error}
            <p className="font-medium">{notification.msg}</p>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-white/10">
          <h3 className="text-2xl font-bold text-white">Editar avatar</h3>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-red-500/80 transition-colors text-white rounded-lg font-bold"
          >
            Cerrar
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50 flex-1">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white">Revisando tu armario…</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 min-h-0">

            {/* ── Panel izquierdo: avatar actual ─────────────────────────── */}
            <div className="md:w-52 shrink-0 flex flex-col items-center justify-start gap-3 p-6 border-b md:border-b-0 md:border-r border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                Actualmente
              </p>
              {/* Contenedor con relación de aspecto 5:6 igual que el viewBox */}
              <div
                className="w-36 overflow-hidden rounded-2xl border-2 border-white/10 shadow-xl bg-slate-800"
                style={{ aspectRatio: '5 / 6' }}
              >
                <Avatar equipped={localEquipped} className="w-full h-full" />
              </div>
            </div>

            {/* ── Panel derecho: items del inventario ────────────────────── */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {ownedItems.length === 0 ? (
                <div className="text-center py-20 text-white/40 italic">
                  No tienes ítems en tu inventario.
                </div>
              ) : (
                <div className="space-y-8">
                  {categories.map(cat => (
                    <section key={cat}>
                      {/* Cabecera de categoría */}
                      <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3 border-b border-white/10 pb-1">
                        {TIPO_LABELS[cat] ?? cat}
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {ownedItems
                          .filter(it => it.tipo === cat)
                          .map(it => {
                            const isEquipped = equippedIds.has(String(it.id_item));
                            return (
                              <button
                                key={it.id_item}
                                onClick={() => handleEquip(it)}
                                disabled={isEquipped}
                                className={`group relative flex flex-col items-center rounded-xl border p-3 transition-all text-left ${
                                  isEquipped
                                    ? 'bg-emerald-500/10 border-emerald-500/50 cursor-default'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer'
                                }`}
                              >
                                {/* Badge "Equipado" */}
                                {isEquipped && (
                                  <span className="absolute top-2 right-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 rounded-full px-1.5 py-0.5 leading-none">
                                    ✓
                                  </span>
                                )}

                                {/* Preview del avatar COMPLETO con este item aplicado */}
                                <div
                                  className="w-full mb-2 overflow-hidden rounded-lg bg-slate-800/60"
                                  style={{ aspectRatio: '5 / 6' }}
                                >
                                  <Avatar
                                    equipped={buildPreview(it)}
                                    className="w-full h-full"
                                  />
                                </div>

                                {/* Nombre */}
                                <span className="text-xs font-semibold text-white text-center leading-tight line-clamp-2">
                                  {it.nombre}
                                </span>

                                {/* Hover overlay para items no equipados */}
                                {!isEquipped && (
                                  <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors">
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-emerald-300 bg-slate-900/80 px-2 py-1 rounded-lg">
                                      Equipar
                                    </span>
                                  </span>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}