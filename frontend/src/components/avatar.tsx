import React from 'react';

// Tipos de elementos SVG (Se mantienen igual)
type SVGElementDef =
  | { type: 'circle';  cx: number; cy: number; r: number;  fill?: string; stroke?: string; strokeWidth?: number; opacity?: number }
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number }
  | { type: 'rect';    x: number;  y: number;  width: number; height: number; rx?: number; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number }
  | { type: 'path';    d: string;  fill?: string; stroke?: string; strokeWidth?: number; strokeLinecap?: string; opacity?: number }
  | { type: 'line';    x1: number; y1: number; x2: number; y2: number; stroke?: string; strokeWidth?: number }
  // permitimos un role opcional para elementos (ej. 'neck') y propiedades extras usadas por el renderer
  & { role?: string; [k: string]: any }

export interface AvatarLayer {
  id: string;
  label: string;
  elements: SVGElementDef[];
}

// Datos vectoriales (Asegúrate de que las keys coincidan con los tipos de tu BD/Service)
export const AVATAR_DATA: Record<string, Record<string, AvatarLayer>> = {
  background: {
    sky_blue: {
      id: 'sky_blue', label: 'Cielo', elements: [
        { type: 'rect', x: 0, y: 0, width: 100, height: 120, fill: '#7dd3fc' }
      ]
    }
  }, // Capa 1 (Fondo)

  clothing: {
    shirt_red: {
      id: 'shirt_red', label: 'Camiseta roja', elements: [
        // La zona del cuello usa el marcador '__NECK__' para heredar color del cuello de la base
        { type: 'rect', x: 20, y: 58, width: 60, height: 30, fill: '#c2410c' },
        { type: 'rect', x: 34, y: 50, width: 32, height: 12, fill: '__NECK__' }
      ]
    }
  }, // Capa 2 (Ropa)

  base: {
    base_peach: {
      id: 'base_peach', label: 'Piel melocotón', elements: [
        // Cabeza
        { type: 'circle', cx: 50, cy: 36, r: 18, fill: '#f6c9a8' },
        // Cuello (marcamos role: 'neck' para detectar color)
        { type: 'rect', x: 40, y: 50, width: 20, height: 8, fill: '#eab38a', role: 'neck' },
        // Torso/armas (brazos incluidos por defecto)
        { type: 'rect', x: 22, y: 58, width: 56, height: 36, rx: 6, fill: '#f6c9a8' },
        { type: 'rect', x: 8, y: 58, width: 12, height: 28, rx: 6, fill: '#f6c9a8' },
        { type: 'rect', x: 80, y: 58, width: 12, height: 28, rx: 6, fill: '#f6c9a8' }
      ]
    }
  }, // Capa 3 (Piel/Cara)

  eyes: {
    default_eyes: {
      id: 'default_eyes', label: 'Ojos por defecto', elements: [
        { type: 'circle', cx: 42, cy: 36, r: 2.5, fill: '#111827' },
        { type: 'circle', cx: 58, cy: 36, r: 2.5, fill: '#111827' }
      ]
    }
  }, // Capa 4 (Ojos/Lentes)

  accessory: {
    none: { id: 'none', label: 'Sin accesorio', elements: [] }
  }, // Capa 5 (Accesorios)

  hair: {
    short_brown: {
      id: 'short_brown', label: 'Pelo corto', elements: [
        { type: 'path', d: 'M30 24 C40 12, 60 12, 70 24 L70 30 C60 20, 40 20, 30 30 Z', fill: '#7c2d12' }
      ]
    }
  }, // Capa 6 (Cabello)
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
    for (const category of Object.values(AVATAR_DATA)) {
      if (category[layerData.id]) return category[layerData.id].elements;
    }

    return [];
  };

  // Obtener capas y aplicar herencia de color de cuello
  const baseElements = getLayerElements(equipped?.base);
  // buscar color de cuello en base (role: 'neck')
  const neckEl = baseElements.find((e: any) => e.role === 'neck') as any | undefined;
  const neckColor = neckEl?.fill ?? null;

  const backgroundElements = getLayerElements(equipped?.background);
  const clothingElements = getLayerElements(equipped?.clothing).map((el: any) => {
    // si elemento usa marcador '__NECK__' lo reemplazamos por neckColor si existe
    if (el.fill === '__NECK__' && neckColor) return { ...el, fill: neckColor };
    return el;
  });
  const eyesElements = getLayerElements(equipped?.eyes);
  const accessoryElements = getLayerElements(equipped?.accessory);
  const hairElements = getLayerElements(equipped?.hair);

  const layers = [
    backgroundElements,
    baseElements,
    eyesElements,
    hairElements,
    clothingElements,
    accessoryElements,
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