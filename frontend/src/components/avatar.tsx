import React, { useMemo } from 'react';

// =============================================================================
// TIPOS
// =============================================================================
type SVGElementDef =
  | { type: 'circle';  cx: number; cy: number; r: number;  fill?: string; stroke?: string; strokeWidth?: number; opacity?: number; role?: string }
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number; role?: string }
  | { type: 'rect';    x: number;  y: number;  width: number; height: number; rx?: number; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number; role?: string }
  | { type: 'path';    d: string;  fill?: string; stroke?: string; strokeWidth?: number; strokeLinecap?: string; strokeLinejoin?: string; opacity?: number; role?: string }
  | { type: 'polygon'; points: string; fill?: string; stroke?: string; strokeWidth?: number; role?: string }
  | { type: 'line';    x1: number; y1: number; x2: number; y2: number; stroke?: string; strokeWidth?: number; strokeLinecap?: string; role?: string }
  | { type: 'linearGradient'; id: string; x1?: string; y1?: string; x2?: string; y2?: string; stops?: Array<{ offset: string; color: string; opacity?: number }> }
  | { type: 'radialGradient'; id: string; cx?: string; cy?: string; r?: string; stops?: Array<{ offset: string; color: string; opacity?: number }> }
  & { [k: string]: any };

export interface AvatarEquipped {
  background?: { id: string; svg?: string | null };
  clothing?:   { id: string; svg?: string | null };
  base?:       { id: string; svg?: string | null };
  eyes?:       { id: string; svg?: string | null };
  accessory?:  { id: string; svg?: string | null };
  hair?:       { id: string; svg?: string | null };
}

interface AvatarProps {
  equipped?: AvatarEquipped;
  size?: number;
  className?: string;
}

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

function renderElement(el: SVGElementDef, key: string) {
  const { type, role, stops, ...props } = el as any;
  
  // Si por algún error queda __NECK__ sin resolver, lo hacemos transparente
  if (props.fill === '__NECK__') props.fill = 'transparent';

  switch (type) {
    case 'circle':  return <circle   key={key} {...props} />;
    case 'ellipse': return <ellipse  key={key} {...props} />;
    case 'rect':    return <rect     key={key} {...props} />;
    case 'path':    return <path     key={key} {...props} />;
    case 'polygon': return <polygon  key={key} {...props} />;
    case 'line':    return <line     key={key} {...props} />;
    
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

    default: return null;
  }
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================
const Avatar = React.memo(function Avatar({
  equipped,
  size = 96,
  className = '',
}: AvatarProps) {
  // Helper para obtener los elementos de un slot (solo desde svg de la BD)
  const getElements = (slot?: { id: string; svg?: string | null }): SVGElementDef[] => {
    if (!slot?.svg) return [];
    try {
      return JSON.parse(slot.svg) as SVGElementDef[];
    } catch (e) {
      console.error(`Error parsing SVG para el item "${slot.id}":`, e);
      return [];
    }
  };

  // Extraer color del cuello (elemento con role="neck") para aplicar a __NECK__
  const baseElements = useMemo(() => getElements(equipped?.base), [equipped?.base]);
  const neckColor = useMemo(() => {
    const neckEl = baseElements.find((e: any) => e.role === 'neck') as any;
    return neckEl?.fill ?? null;
  }, [baseElements]);

  // Función para reemplazar __NECK__ en los elementos que lo necesiten
  const resolveNeck = (elems: SVGElementDef[]) =>
    neckColor
      ? elems.map((e: any) => e.fill === '__NECK__' ? { ...e, fill: neckColor } : e)
      : elems;

  // Obtener elementos de cada capa
  const backgroundElements = useMemo(() => getElements(equipped?.background), [equipped?.background]);
  const clothingElements   = useMemo(() => resolveNeck(getElements(equipped?.clothing)), [equipped?.clothing, neckColor]);
  const eyesElements       = useMemo(() => getElements(equipped?.eyes), [equipped?.eyes]);
  const accessoryElements  = useMemo(() => getElements(equipped?.accessory), [equipped?.accessory]);
  const hairElements       = useMemo(() => getElements(equipped?.hair), [equipped?.hair]);

  // ORDEN DE CAPAS (primero = más al fondo)
  const layers = useMemo(() => [
    backgroundElements,
    baseElements,
    clothingElements,
    eyesElements,
    accessoryElements,
    hairElements,
  ], [
    backgroundElements,
    baseElements,
    clothingElements,
    eyesElements,
    accessoryElements,
    hairElements,
  ]);

  // Separar gradientes del resto de elementos
  const allGradients = useMemo(() => {
    const gradients: SVGElementDef[] = [];
    layers.forEach(layer => {
      layer.forEach(el => {
        if (el.type === 'linearGradient' || el.type === 'radialGradient') {
          gradients.push(el);
        }
      });
    });
    return gradients;
  }, [layers]);

  return (
    <svg
      viewBox="0 0 100 120"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      shapeRendering="geometricPrecision"
      style={{ display: 'block' }}
    >
      <defs>
        {allGradients.map((gradient, idx) =>
          renderElement(gradient, `gradient-${idx}`)
        )}
      </defs>

      {layers.map((elements, layerIndex) =>
        elements.map((el, elemIndex) => {
          // Saltar gradientes ya renderizados en <defs>
          if (el.type === 'linearGradient' || el.type === 'radialGradient') return null;
          return renderElement(el, `layer-${layerIndex}-${elemIndex}`);
        })
      )}
    </svg>
  );
});

export default Avatar;