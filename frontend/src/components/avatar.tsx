import React from 'react';

// Tipos de elementos SVG (Se mantienen igual)
type SVGElementDef =
  | { type: 'circle';  cx: number; cy: number; r: number;  fill?: string; stroke?: string; strokeWidth?: number; opacity?: number }
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number }
  | { type: 'rect';    x: number;  y: number;  width: number; height: number; rx?: number; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number }
  | { type: 'path';    d: string;  fill?: string; stroke?: string; strokeWidth?: number; strokeLinecap?: string; opacity?: number }
  | { type: 'line';    x1: number; y1: number; x2: number; y2: number; stroke?: string; strokeWidth?: number };

export interface AvatarLayer {
  id: string;
  label: string;
  elements: SVGElementDef[];
}

// Datos vectoriales (Asegúrate de que las keys coincidan con los tipos de tu BD/Service)
export const AVATAR_DATA: Record<string, Record<string, AvatarLayer>> = {
  background: {}, // Capa 1 (Fondo)
  clothing:   {}, // Capa 2 (Ropa - Detrás de la piel)
  base:       {}, // Capa 3 (Piel/Cara)
  eyes:       {}, // Capa 4 (Ojos/Lentes)
  accessory:  {}, // Capa 5 (Collares/Extras)
  hair:       {}, // Capa 6 (Cabello/Gorro - Arriba de todo)
};

// Helper para buscar la capa en cualquier categoría
function findLayer(id?: string): AvatarLayer | null {
  if (!id) return null;
  for (const category of Object.values(AVATAR_DATA)) {
    if (category[id]) return category[id];
  }
  return null;
}

function renderElement(el: SVGElementDef, key: string) {
  const { type, ...props } = el as any;
  switch (type) {
    case 'circle':  return <circle  key={key} {...props} />;
    case 'ellipse': return <ellipse key={key} {...props} />;
    case 'rect':    return <rect    key={key} {...props} />;
    case 'path':    return <path    key={key} {...props} />;
    case 'line':    return <line    key={key} {...props} />;
    default:        return null;
  }
}

// Props alineadas con usuario.service
export interface AvatarEquipped {
  background?: { id: string; svg?: string | null };
  base?:       { id: string; svg?: string | null };
  clothing?:   { id: string; svg?: string | null };
  eyes?:       { id: string; svg?: string | null };
  hair?:       { id: string; svg?: string | null };
  accessory?:  { id: string; svg?: string | null };
}

interface AvatarProps {
  equipped?: AvatarEquipped;
  size?: number;
  className?: string;
}

export default function Avatar({
  equipped,
  size,
  className = "w-32 h-32",
}: AvatarProps) {
  
  // Función interna para obtener los elementos de una capa
  const getLayerElements = (layerData?: { id: string; svg?: string | null }) => {
    if (!layerData) return [];

    // 1. Intentar parsear el SVG que viene de la BD (prioridad si existe)
    if (layerData.svg) {
      try {
        return JSON.parse(layerData.svg) as SVGElementDef[];
      } catch (e) {
        console.error("Error parseando SVG de la BD para:", layerData.id, e);
      }
    }

    // 2. Si no hay SVG en la BD, buscar en el diccionario local AVATAR_DATA
    // (Esto sirve para los items por defecto o "hardcodeados")
    for (const category of Object.values(AVATAR_DATA)) {
       if (category[layerData.id]) return category[layerData.id].elements;
    }

    return [];
  };

  // Orden de capas según tu propuesta en usuario.service
  const layers = [
    getLayerElements(equipped?.background),
    getLayerElements(equipped?.clothing),
    getLayerElements(equipped?.base),
    getLayerElements(equipped?.eyes),
    getLayerElements(equipped?.accessory),
    getLayerElements(equipped?.hair),
  ];

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
      {layers.map((elements, lIdx) => 
        elements.map((el, eIdx) => renderElement(el, `layer-${lIdx}-el-${eIdx}`))
      )}
    </svg>
  );
}