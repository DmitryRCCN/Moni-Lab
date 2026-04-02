import { useState, useMemo } from 'react';
import Avatar, { type AvatarEquipped } from './avatar';

type SVGElementDef =
  | { type: 'rect'; x: number; y: number; width: number; height: number; rx?: number; fill?: string; stroke?: string; strokeWidth?: number }
  | { type: 'circle'; cx: number; cy: number; r: number; fill?: string; stroke?: string; strokeWidth?: number }
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number; fill?: string; stroke?: string; strokeWidth?: number }
  | { type: 'path'; d: string; fill?: string; stroke?: string; strokeWidth?: number; strokeLinecap?: string; strokeLinejoin?: string }
  | { type: 'polygon'; points: string; fill?: string; stroke?: string; strokeWidth?: number }
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number; stroke?: string; strokeWidth?: number; strokeLinecap?: string }
  | { type: 'linearGradient'; id: string; x1?: string; y1?: string; x2?: string; y2?: string; stops?: Array<{ offset: string; color: string; opacity?: number }> }
  | { type: 'radialGradient'; id: string; cx?: string; cy?: string; r?: string; stops?: Array<{ offset: string; color: string; opacity?: number }> }
  & { [k: string]: any };

// Base de ejemplo: Mono Oscuro
const EXAMPLE_BASE: SVGElementDef[] = [
  {
    "type": "path",
    "d": "M4,100 Q4,78 18,72 Q30,68 50,68 Q70,68 82,72 Q96,78 96,100",
    "fill": "#3D1A05",
    "stroke": "#1A1A2E",
    "strokeWidth": 3,
    "role": "neck"
  },
  {
    "type": "circle",
    "cx": 50,
    "cy": 40,
    "r": 34,
    "fill": "#3D1A05",
    "stroke": "#1A1A2E",
    "strokeWidth": 3
  },
  {
    "type": "circle",
    "cx": 14,
    "cy": 42,
    "r": 11,
    "fill": "#3D1A05",
    "stroke": "#1A1A2E",
    "strokeWidth": 3
  },
  {
    "type": "ellipse",
    "cx": 14,
    "cy": 44,
    "rx": 6,
    "ry": 7,
    "fill": "#7A3C18"
  },
  {
    "type": "circle",
    "cx": 86,
    "cy": 42,
    "r": 11,
    "fill": "#3D1A05",
    "stroke": "#1A1A2E",
    "strokeWidth": 3
  },
  {
    "type": "ellipse",
    "cx": 86,
    "cy": 44,
    "rx": 6,
    "ry": 7,
    "fill": "#7A3C18"
  },
  {
    "type": "ellipse",
    "cx": 37,
    "cy": 24,
    "rx": 10,
    "ry": 7,
    "fill": "#5A2A0A",
    "opacity": 0.4
  },
  {
    "type": "ellipse",
    "cx": 50,
    "cy": 58,
    "rx": 16,
    "ry": 11,
    "fill": "#9A5A28",
    "stroke": "#1A1A2E",
    "strokeWidth": 3
  },
  {
    "type": "ellipse",
    "cx": 50,
    "cy": 56,
    "rx": 11,
    "ry": 7,
    "fill": "#C07040",
    "opacity": 0.4
  },
  {
    "type": "line",
    "x1": 50,
    "y1": 52,
    "x2": 50,
    "y2": 59,
    "stroke": "#6A3010",
    "strokeWidth": 1.5,
    "strokeLinecap": "round"
  },
  {
    "type": "ellipse",
    "cx": 44,
    "cy": 55,
    "rx": 2.5,
    "ry": 2,
    "fill": "#200C02"
  },
  {
    "type": "ellipse",
    "cx": 56,
    "cy": 55,
    "rx": 2.5,
    "ry": 2,
    "fill": "#200C02"
  },
  {
    "type": "ellipse",
    "cx": 27,
    "cy": 50,
    "rx": 7,
    "ry": 5,
    "fill": "#FF8888",
    "opacity": 0.5
  },
  {
    "type": "ellipse",
    "cx": 73,
    "cy": 50,
    "rx": 7,
    "ry": 5,
    "fill": "#FF8888",
    "opacity": 0.5
  }
];

export default function ItemEditor() {
  const [elements, setElements] = useState<SVGElementDef[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [importJson, setImportJson] = useState('');
  const [elementType, setElementType] = useState<'rect' | 'circle' | 'ellipse' | 'path' | 'polygon' | 'line'>('rect');
  
  // Estado para capas equipadas
  const [equippedLayers, setEquippedLayers] = useState<AvatarEquipped>({});
  const [visibleLayers, setVisibleLayers] = useState({
    background: true,
    base: true,
    clothing: true,
    eyes: true,
    accessory: true,
    hair: true,
  });

  // Renderizar elemento SVG
  function renderElement(el: SVGElementDef, key: string) {
    const { type, stops, ...props } = el as any;
    switch (type) {
      case 'circle':
        return <circle key={key} {...props} />;
      case 'ellipse':
        return <ellipse key={key} {...props} />;
      case 'rect':
        return <rect key={key} {...props} />;
      case 'path':
        return <path key={key} {...props} />;
      case 'polygon':
        return <polygon key={key} {...props} />;
      case 'line':
        return <line key={key} {...props} />;
      case 'linearGradient':
        return (
          <linearGradient key={key} {...props}>
            {stops?.map((stop: any, idx: number) => (
              <stop
                key={`stop-${idx}`}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity ?? 1}
              />
            ))}
          </linearGradient>
        );
      case 'radialGradient':
        return (
          <radialGradient key={key} {...props}>
            {stops?.map((stop: any, idx: number) => (
              <stop
                key={`stop-${idx}`}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity ?? 1}
              />
            ))}
          </radialGradient>
        );
      default:
        return null;
    }
  }

  // Gradiantes
  const gradients = useMemo(
    () => elements.filter(e => e.type === 'linearGradient' || e.type === 'radialGradient'),
    [elements]
  );

  // Elementos no-gradiente
  const nonGradients = useMemo(
    () => elements.filter(e => e.type !== 'linearGradient' && e.type !== 'radialGradient'),
    [elements]
  );

  // Agregar elemento
  const addElement = () => {
    let newEl: SVGElementDef;
    switch (elementType) {
      case 'rect':
        newEl = { type: 'rect', x: 20, y: 40, width: 60, height: 48, fill: '#FF5733', stroke: '#000', strokeWidth: 2, rx: 4 };
        break;
      case 'circle':
        newEl = { type: 'circle', cx: 50, cy: 60, r: 15, fill: '#FF5733', stroke: '#000', strokeWidth: 2 };
        break;
      case 'ellipse':
        newEl = { type: 'ellipse', cx: 50, cy: 60, rx: 25, ry: 15, fill: '#FF5733', stroke: '#000', strokeWidth: 2 };
        break;
      case 'path':
        newEl = { type: 'path', d: 'M 50 40 L 60 60 L 40 60 Z', fill: '#FF5733', stroke: '#000', strokeWidth: 2 };
        break;
      case 'polygon':
        newEl = { type: 'polygon', points: '50,10 90,90 10,90', fill: '#FF5733', stroke: '#000', strokeWidth: 2 };
        break;
      case 'line':
        newEl = { type: 'line', x1: 10, y1: 10, x2: 90, y2: 110, stroke: '#000', strokeWidth: 2, strokeLinecap: 'round' };
        break;
      default:
        return;
    }
    setElements([...elements, newEl]);
    setSelectedIndex(elements.length);
  };

  // Eliminar elemento
  const removeElement = (index: number) => {
    setElements(elements.filter((_, i) => i !== index));
    setSelectedIndex(null);
  };

  // Actualizar elemento
  const updateElement = (index: number, key: string, value: any) => {
    const updated = [...elements];
    (updated[index] as any)[key] = value === '' ? undefined : value;
    setElements(updated);
  };

  // Duplicar elemento
  const duplicateElement = (index: number) => {
    const dup = JSON.parse(JSON.stringify(elements[index]));
    const newElements = [...elements];
    newElements.splice(index + 1, 0, dup);
    setElements(newElements);
  };

  // Importar desde JSON
  const importFromJson = () => {
    try {
      const parsed = JSON.parse(importJson) as SVGElementDef[];
      if (Array.isArray(parsed)) {
        setElements(parsed);
        setImportJson('');
        setSelectedIndex(null);
      }
    } catch (_e) {
      alert('JSON inválido');
    }
  };

  // Copiar JSON
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(elements, null, 2)).then(() => {
      alert('✅ JSON copiado al portapapeles');
    });
  };

  // Importar capas equipadas
  const importEquippedLayer = (layerType: keyof AvatarEquipped, json: string) => {
    try {
      const parsed = JSON.parse(json) as SVGElementDef[];
      if (Array.isArray(parsed)) {
        setEquippedLayers(prev => ({
          ...prev,
          [layerType]: { id: layerType, svg: json }
        }));
      }
    } catch (e) {
      alert(`JSON inválido para capa ${layerType}`);
    }
  };

  // Limpiar capa equipada
  const clearEquippedLayer = (layerType: keyof AvatarEquipped) => {
    setEquippedLayers(prev => ({
      ...prev,
      [layerType]: undefined
    }));
  };

  // Toggle visibilidad de capa
  const toggleLayerVisibility = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  // Avatar preview con capas equipadas
  const preview: AvatarEquipped = useMemo(
    () => {
      const base: AvatarEquipped = {
        background: visibleLayers.background ? equippedLayers.background : undefined,
        base: visibleLayers.base ? equippedLayers.base : undefined,
        clothing: visibleLayers.clothing ? equippedLayers.clothing : undefined,
        eyes: visibleLayers.eyes ? equippedLayers.eyes : undefined,
        accessory: visibleLayers.accessory ? equippedLayers.accessory : undefined,
        hair: visibleLayers.hair ? equippedLayers.hair : undefined,
      };
      
      // El item editado SIEMPRE en la capa más alta (hair) para que se vea encima de todo
      return {
        ...base,
        hair: { id: 'editor', svg: JSON.stringify(elements) },
      };
    },
    [elements, equippedLayers, visibleLayers]
  );

  const selectedEl = selectedIndex !== null ? elements[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">✨ Editor Visual de Avatares</h1>
          <p className="text-white/60">Crea items SVG visualmente sin adivinar coordenadas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ============= PANEL CENTRAL: Preview ============= */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-4">🎨 Vista Previa</h3>

              {/* SVG Preview */}
              <div className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-xl p-4 mb-6 overflow-hidden">
                <svg
                  viewBox="0 0 100 120"
                  width="100%"
                  height={400}
                  xmlns="http://www.w3.org/2000/svg"
                  className="bg-slate-900 rounded border border-white/10"
                  style={{ maxWidth: '100%' }}
                >
                  <defs>
                    {gradients.map((g, i) => renderElement(g, `grad-${i}`))}
                  </defs>

                  {/* Fondo de referencia */}
                  <rect x={0} y={0} width={100} height={120} fill="#1e293b" opacity={0.3} />

                  {/* Líneas de zona */}
                  <line x1={0} y1={5} x2={100} y2={5} stroke="#666" strokeWidth={0.5} strokeDasharray="2,2" />
                  <line x1={0} y1={28} x2={100} y2={28} stroke="#666" strokeWidth={0.5} strokeDasharray="2,2" />
                  <line x1={0} y1={40} x2={100} y2={40} stroke="#666" strokeWidth={0.5} strokeDasharray="2,2" />
                  <line x1={0} y1={85} x2={100} y2={85} stroke="#666" strokeWidth={0.5} strokeDasharray="2,2" />

                  {/* Elementos */}
                  {nonGradients.map((el, i) => (
                    <g key={i} opacity={el.type === 'path' ? 0.8 : 1}>
                      {renderElement(el, `elem-${i}`)}
                    </g>
                  ))}
                </svg>
              </div>

              {/* Avatar Completo */}
              <div className="bg-slate-700 rounded-xl p-4 text-center">
                <p className="text-xs text-white/50 mb-2">Avatar Completo (con base)</p>
                <div
                  className="mx-auto bg-slate-800 rounded border border-white/20"
                  style={{ width: '150px', aspectRatio: '5 / 6' }}
                >
                  <Avatar equipped={preview} className="w-full h-full" />
                </div>
              </div>

              {/* Información de zonas */}
              <div className="mt-6 text-xs text-white/40 space-y-1 border-t border-white/10 pt-4">
                <p>📏 <strong>Zonas Y:</strong></p>
                <p>• 0-5: Fondos (cubren todo)</p>
                <p>• 5-28: Cabello/Gorras</p>
                <p>• 28-40: Cuello/Bufandas</p>
                <p>• 40-85: Ropa Principal</p>
                <p>• 85-120: Accesorios bajos</p>
              </div>
            </div>
          </div>

          {/* ============= PANEL DERECHO: Controles ============= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agregar elemento */}
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">➕ Agregar Elemento</h3>

              <div className="space-y-3">
                <select
                  value={elementType}
                  onChange={(e) => setElementType(e.target.value as any)}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-white/20 focus:border-emerald-500 outline-none"
                >
                  <option value="rect">Rectángulo</option>
                  <option value="circle">Círculo</option>
                  <option value="ellipse">Elipse</option>
                  <option value="path">Path</option>
                  <option value="polygon">Polígono</option>
                  <option value="line">Línea</option>
                </select>

                <button
                  onClick={addElement}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Elemento seleccionado */}
            {selectedEl && (
              <div className="bg-slate-800/50 border border-emerald-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-emerald-300">✎ Editar: {selectedEl.type}</h3>
                  <button
                    onClick={() => removeElement(selectedIndex!)}
                    className="px-3 py-1 bg-red-600/20 text-red-300 hover:bg-red-600/40 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </div>

                <button
                  onClick={() => duplicateElement(selectedIndex!)}
                  className="w-full px-3 py-1 bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 rounded text-sm mb-4"
                >
                  Duplicar
                </button>

                {/* Campos disponibles según tipo */}
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {/* Posición X, Y */}
                  {['rect', 'circle', 'ellipse', 'line'].includes(selectedEl.type) && (
                    <>
                      {'x' in selectedEl && (
                        <div>
                          <label className="text-xs text-white/60 block mb-1">X</label>
                          <input
                            type="number"
                            value={selectedEl.x}
                            onChange={(e) => updateElement(selectedIndex!, 'x', parseFloat(e.target.value))}
                            className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                          />
                        </div>
                      )}
                      {'y' in selectedEl && (
                        <div>
                          <label className="text-xs text-white/60 block mb-1">Y</label>
                          <input
                            type="number"
                            value={selectedEl.y}
                            onChange={(e) => updateElement(selectedIndex!, 'y', parseFloat(e.target.value))}
                            className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Dimensiones */}
                  {'width' in selectedEl && (
                    <div>
                      <label className="text-xs text-white/60 block mb-1">Width</label>
                      <input
                        type="number"
                        value={selectedEl.width}
                        onChange={(e) => updateElement(selectedIndex!, 'width', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  )}
                  {'height' in selectedEl && (
                    <div>
                      <label className="text-xs text-white/60 block mb-1">Height</label>
                      <input
                        type="number"
                        value={selectedEl.height}
                        onChange={(e) => updateElement(selectedIndex!, 'height', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  )}

                  {/* Radio */}
                  {'r' in selectedEl && (
                    <div>
                      <label className="text-xs text-white/60 block mb-1">Radio (r)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={selectedEl.r}
                        onChange={(e) => updateElement(selectedIndex!, 'r', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  )}
                  {'cx' in selectedEl && (
                    <div>
                      <label className="text-xs text-white/60 block mb-1">CX (Centro X)</label>
                      <input
                        type="number"
                        value={selectedEl.cx}
                        onChange={(e) => updateElement(selectedIndex!, 'cx', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  )}
                  {'cy' in selectedEl && (
                    <div>
                      <label className="text-xs text-white/60 block mb-1">CY (Centro Y)</label>
                      <input
                        type="number"
                        value={selectedEl.cy}
                        onChange={(e) => updateElement(selectedIndex!, 'cy', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  )}
                  {'rx' in selectedEl && (
                    <div>
                      <label className="text-xs text-white/60 block mb-1">RX (Radio X)</label>
                      <input
                        type="number"
                        value={selectedEl.rx}
                        onChange={(e) => updateElement(selectedIndex!, 'rx', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  )}
                  {'ry' in selectedEl && (
                    <div>
                      <label className="text-xs text-white/60 block mb-1">RY (Radio Y)</label>
                      <input
                        type="number"
                        value={selectedEl.ry}
                        onChange={(e) => updateElement(selectedIndex!, 'ry', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  )}

                  {/* Path */}
                  {'d' in selectedEl && (
                    <div>
                      <label className="text-xs text-white/60 block mb-1">Path (d)</label>
                      <textarea
                        value={selectedEl.d}
                        onChange={(e) => updateElement(selectedIndex!, 'd', e.target.value)}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none text-xs h-12"
                      />
                    </div>
                  )}

                  {/* Points */}
                  {'points' in selectedEl && (
                    <div>
                      <label className="text-xs text-white/60 block mb-1">Points</label>
                      <textarea
                        value={selectedEl.points}
                        onChange={(e) => updateElement(selectedIndex!, 'points', e.target.value)}
                        className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none text-xs h-12"
                      />
                    </div>
                  )}

                  {/* Colores */}
                  {['rect', 'circle', 'ellipse', 'path', 'polygon'].includes(selectedEl.type) && (
                    <>
                      <div>
                        <label className="text-xs text-white/60 block mb-1">Fill</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={selectedEl.fill || '#FF5733'}
                            onChange={(e) => updateElement(selectedIndex!, 'fill', e.target.value)}
                            className="w-10 h-8 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedEl.fill || ''}
                            onChange={(e) => updateElement(selectedIndex!, 'fill', e.target.value)}
                            className="flex-1 px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                            placeholder="ej: #FF5733"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-white/60 block mb-1">Stroke</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={selectedEl.stroke || '#000000'}
                            onChange={(e) => updateElement(selectedIndex!, 'stroke', e.target.value)}
                            className="w-10 h-8 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedEl.stroke || ''}
                            onChange={(e) => updateElement(selectedIndex!, 'stroke', e.target.value)}
                            className="flex-1 px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                            placeholder="ej: #000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-white/60 block mb-1">Stroke Width</label>
                        <input
                          type="number"
                          step="0.5"
                          value={selectedEl.strokeWidth || 1}
                          onChange={(e) => updateElement(selectedIndex!, 'strokeWidth', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </>
                  )}

                  {selectedEl.type === 'line' && (
                    <>
                      <div>
                        <label className="text-xs text-white/60 block mb-1">X1</label>
                        <input
                          type="number"
                          value={selectedEl.x1}
                          onChange={(e) => updateElement(selectedIndex!, 'x1', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/60 block mb-1">Y1</label>
                        <input
                          type="number"
                          value={selectedEl.y1}
                          onChange={(e) => updateElement(selectedIndex!, 'y1', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/60 block mb-1">X2</label>
                        <input
                          type="number"
                          value={selectedEl.x2}
                          onChange={(e) => updateElement(selectedIndex!, 'x2', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/60 block mb-1">Y2</label>
                        <input
                          type="number"
                          value={selectedEl.y2}
                          onChange={(e) => updateElement(selectedIndex!, 'y2', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 text-white rounded text-sm border border-white/20 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Lista de elementos */}
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">📋 Elementos ({elements.length})</h3>

              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {elements.length === 0 ? (
                  <p className="text-white/40 text-sm">Sin elementos aún</p>
                ) : (
                  elements.map((el, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedIndex(i)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedIndex === i
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {i + 1}. {el.type}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Capas Equipadas */}
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🎭 Capas Equipadas</h3>

              <button
                onClick={() => {
                  setEquippedLayers(prev => ({
                    ...prev,
                    base: { id: 'base_dark', svg: JSON.stringify(EXAMPLE_BASE) }
                  }));
                  setVisibleLayers(prev => ({ ...prev, base: true }));
                }}
                className="w-full px-3 py-2 mb-3 text-sm bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40 rounded"
              >
                📦 Cargar Base Ejemplo (Mono Oscuro)
              </button>

              <div className="space-y-2">
                {Object.entries(visibleLayers).map(([layer, visible]) => (
                  equippedLayers[layer as keyof AvatarEquipped] && (
                    <div
                      key={layer}
                      className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={visible}
                          onChange={() => toggleLayerVisibility(layer as keyof typeof visibleLayers)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-white/80 capitalize">{layer}</span>
                      </div>
                      <button
                        onClick={() => clearEquippedLayer(layer as keyof AvatarEquipped)}
                        className="px-2 py-1 text-xs bg-red-600/20 text-red-300 hover:bg-red-600/40 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  )
                ))}
                {Object.values(equippedLayers).every(v => !v) && (
                  <p className="text-white/40 text-sm">Sin capas equipadas</p>
                )}
              </div>
            </div>

            {/* Export/Import y Capas */}
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-bold text-white mb-4">📥 Importar Capas / Exportar</h3>

              <div className="space-y-2">
                <label className="text-xs text-white/60 block">Selecciona capa para importar:</label>
                <select
                  defaultValue="base"
                  onChange={(e) => {
                    const layer = e.target.value as keyof AvatarEquipped;
                    if (importJson.trim()) {
                      importEquippedLayer(layer, importJson);
                      setImportJson('');
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-white/20 focus:border-emerald-500 outline-none text-sm"
                >
                  <option value="base">Base (Mono)</option>
                  <option value="clothing">Ropa</option>
                  <option value="hair">Cabello</option>
                  <option value="eyes">Ojos</option>
                  <option value="accessory">Accesorios</option>
                  <option value="background">Fondo</option>
                </select>
              </div>

              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Pega aquí un JSON de capa para importar..."
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-white/20 focus:border-emerald-500 outline-none text-sm h-20"
              />

              <button
                onClick={copyToClipboard}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                📋 Copiar Item Actual
              </button>

              <button
                onClick={importFromJson}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                📤 Importar Item Editado
              </button>

              <p className="text-xs text-white/40 text-center">
                ✅ Copia el JSON del item actual y pégalo en la BD
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}