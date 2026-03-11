import React from 'react';


// Pegamos aquí el objeto que te dio Claude (lo llamaremos AVATAR_DATA para claridad)
export const AVATAR_DATA = {
  bases: {
    mono_robot: {
      id: "mono_robot",
      label: "Mono Robot",
      category: "base",
      paths: [
        // Cuerpo metálico principal (gris acero)
        { d: "M7,13 h10 v8 H7 Z M6,14 h1 v6 H6 Z M17,14 h1 v6 h-1 Z", fill: "#8A9BB0" },
        // Cabeza (panel frontal metálico)
        { d: "M6,5 h12 v9 H6 Z", fill: "#A8BDD4" },
        // Orejas/laterales metálicos
        { d: "M4,7 h2 v5 H4 Z M18,7 h2 v5 h-2 Z", fill: "#6E7F94" },
        // Tornillos oreja izq
        { d: "M4,8 h1 v1 H4 Z M4,11 h1 v1 H4 Z", fill: "#C0D0E0" },
        // Tornillos oreja der
        { d: "M19,8 h1 v1 h-1 Z M19,11 h1 v1 h-1 Z", fill: "#C0D0E0" },
        // Zona ojos (visor oscuro)
        { d: "M7,7 h10 v4 H7 Z", fill: "#1A2535" },
        // Ojos LED (rojo robot)
        { d: "M8,8 h3 v2 H8 Z M13,8 h3 v2 h-3 Z", fill: "#FF3A3A" },
        // Brillo ojo izq
        { d: "M8,8 h1 v1 H8 Z M13,8 h1 v1 h-1 Z", fill: "#FF9999" },
        // Boca rejilla
        { d: "M9,12 h1 v1 H9 Z M11,12 h1 v1 h-1 Z M13,12 h1 v1 h-1 Z", fill: "#1A2535" },
        // Panel pecho con luces
        { d: "M9,15 h6 v4 H9 Z", fill: "#6E7F94" },
        // Luces pecho
        { d: "M10,16 h1 v1 h-1 Z M12,16 h1 v1 h-1 Z M14,16 h1 v1 h-1 Z", fill: "#00FFAA" },
        { d: "M10,18 h4 v1 h-4 Z", fill: "#00AAFF" },
        // Líneas de panel (detalles metálicos)
        { d: "M7,14 h10 v1 H7 Z", fill: "#7A8FA8" },
        // Pies
        { d: "M7,21 h4 v2 H7 Z M13,21 h4 v2 h-4 Z", fill: "#6E7F94" },
        // Sombra/base cuello
        { d: "M9,13 h6 v1 H9 Z", fill: "#6E7F94" },
      ]
    },

    mono_zombie: {
      id: "mono_zombie",
      label: "Mono Zombie",
      category: "base",
      paths: [
        // Cuerpo verde pálido
        { d: "M7,13 h10 v8 H7 Z M6,14 h1 v6 H6 Z M17,14 h1 v6 h-1 Z", fill: "#7BAE7F" },
        // Cabeza
        { d: "M6,5 h12 v9 H6 Z", fill: "#8FBF82" },
        // Orejas
        { d: "M4,7 h2 v5 H4 Z M18,7 h2 v5 h-2 Z", fill: "#7BAE7F" },
        // Manchas de podredumbre
        { d: "M7,6 h2 v1 H7 Z M15,9 h2 v2 h-2 Z M8,14 h2 v2 H8 Z M15,16 h2 v2 h-2 Z", fill: "#5A8A5E" },
        // Zona ojos
        { d: "M7,7 h10 v4 H7 Z", fill: "#2D1B0E" },
        // Ojos zombie (uno normal, uno fuera de órbita)
        { d: "M8,8 h3 v2 H8 Z", fill: "#FFDD00" },
        { d: "M13,7 h3 v3 h-3 Z", fill: "#FFDD00" },
        // Pupila izquierda (normal)
        { d: "M9,8 h1 v1 H9 Z", fill: "#1A0A00" },
        // Pupila derecha (desorbitada)
        { d: "M14,7 h1 v1 h-1 Z", fill: "#1A0A00" },
        // Brillo ojos
        { d: "M8,8 h1 v1 H8 Z M13,7 h1 v1 h-1 Z", fill: "#FFFFAA" },
        // Boca zombie (cosida)
        { d: "M8,12 h8 v1 H8 Z", fill: "#3D1A0A" },
        { d: "M9,11 h1 v2 H9 Z M11,11 h1 v2 h-1 Z M13,11 h1 v2 h-1 Z M15,11 h1 v2 h-1 Z", fill: "#5A2A15" },
        // Ropa desgarrada
        { d: "M9,13 h6 v1 H9 Z", fill: "#6E9E72" },
        { d: "M8,15 h3 v5 H8 Z M13,15 h3 v5 h-3 Z", fill: "#6E9E72" },
        // Jirones de ropa
        { d: "M11,17 h2 v1 h-2 Z M10,19 h1 v2 h-1 Z M13,20 h1 v2 h-1 Z", fill: "#5A8A5E" },
        // Pies
        { d: "M7,21 h4 v2 H7 Z M13,21 h4 v2 h-4 Z", fill: "#7BAE7F" },
        // Herida en pecho
        { d: "M11,15 h2 v3 h-2 Z", fill: "#5A1010" },
        { d: "M11,16 h2 v1 h-2 Z", fill: "#8B1A1A" },
      ]
    }
  },

  expressions: {
    lentes_hacker: {
      id: "lentes_hacker",
      label: "Lentes de Hacker",
      category: "expression",
      paths: [
        // Montura exterior (negro)
        { d: "M6,7 h5 v1 H6 Z M13,7 h5 v1 h-5 Z M6,7 h1 v4 H6 Z M10,7 h1 v4 h-1 Z M13,7 h1 v4 h-1 Z M17,7 h1 v4 h-1 Z M6,10 h5 v1 H6 Z M13,10 h5 v1 h-5 Z", fill: "#111111" },
        // Puente entre lentes
        { d: "M11,8 h2 v1 h-2 Z", fill: "#111111" },
        // Cristal izquierdo (verde Matrix oscuro)
        { d: "M7,8 h3 v2 H7 Z", fill: "#001A00" },
        // Cristal derecho
        { d: "M14,8 h3 v2 h-3 Z", fill: "#001A00" },
        // Caracteres Matrix izq
        { d: "M7,8 h1 v1 H7 Z M9,9 h1 v1 H9 Z", fill: "#00FF41" },
        // Caracteres Matrix der
        { d: "M14,8 h1 v1 h-1 Z M16,9 h1 v1 h-1 Z", fill: "#00FF41" },
        // Brillo/reflejo izq
        { d: "M7,8 h1 v1 H7 Z", fill: "#33FF66" },
        // Brillo/reflejo der
        { d: "M17,8 h1 v1 h-1 Z", fill: "#33FF66" },
        // Patillas
        { d: "M5,8 h1 v2 H5 Z M18,8 h1 v2 h-1 Z", fill: "#222222" },
      ]
    },

    bigote_millonario: {
      id: "bigote_millonario",
      label: "Bigote de Millonario",
      category: "expression",
      paths: [
        // Bigote principal (negro azabache, estilo handlebar)
        { d: "M8,12 h8 v1 H8 Z", fill: "#1A1008" },
        // Volumen superior bigote
        { d: "M9,11 h6 v1 H9 Z", fill: "#1A1008" },
        // Puntas curvadas izquierda
        { d: "M7,12 h1 v1 H7 Z M6,11 h1 v1 H6 Z M5,10 h1 v1 H5 Z", fill: "#1A1008" },
        // Puntas curvadas derecha
        { d: "M16,12 h1 v1 h-1 Z M17,11 h1 v1 h-1 Z M18,10 h1 v1 h-1 Z", fill: "#1A1008" },
        // Brillo/lustre (cera de bigote)
        { d: "M9,11 h2 v1 H9 Z", fill: "#3D2A18" },
        { d: "M13,11 h2 v1 h-2 Z", fill: "#3D2A18" },
        // Centro del bigote (filtrum)
        { d: "M11,12 h2 v1 h-2 Z", fill: "#2A1A0A" },
      ]
    }
  },

  accessories: {
    corona_oro: {
      id: "corona_oro",
      label: "Corona de Oro",
      category: "accessory",
      paths: [
        // Base de la corona
        { d: "M6,5 h12 v2 H6 Z", fill: "#D4A017" },
        // Picos de la corona
        { d: "M6,2 h2 v3 H6 Z M10,1 h2 v4 h-2 Z M14,2 h2 v3 h-2 Z", fill: "#D4A017" },
        // Pico central más alto
        { d: "M11,0 h2 v1 h-2 Z", fill: "#FFD700" },
        // Borde superior corona
        { d: "M6,5 h12 v1 H6 Z", fill: "#FFD700" },
        // Borde inferior corona
        { d: "M6,6 h12 v1 H6 Z", fill: "#B8860B" },
        // Gemas incrustadas
        { d: "M7,5 h2 v1 H7 Z", fill: "#FF1744" },   // rubí izq
        { d: "M11,5 h2 v1 h-2 Z", fill: "#00E5FF" },  // zafiro centro
        { d: "M15,5 h2 v1 h-2 Z", fill: "#FF1744" },  // rubí der
        // Brillo gemas
        { d: "M7,5 h1 v1 H7 Z M11,5 h1 v1 h-1 Z M15,5 h1 v1 h-1 Z", fill: "#FFFFFF" },
        // Detalles filigrana
        { d: "M8,3 h1 v1 H8 Z M11,2 h1 v1 h-1 Z M14,3 h1 v1 h-1 Z", fill: "#FFD700" },
        // Sombra base
        { d: "M7,6 h10 v1 H7 Z", fill: "#C8961A" },
      ]
    },

    sombrero_copa: {
      id: "sombrero_copa",
      label: "Sombrero de Copa Alta",
      category: "accessory",
      paths: [
        // Ala del sombrero (amplia)
        { d: "M3,7 h18 v2 H3 Z", fill: "#1A1008" },
        // Cuerpo del sombrero (tubo alto)
        { d: "M7,0 h10 v7 H7 Z", fill: "#1A1008" },
        // Banda decorativa
        { d: "M7,5 h10 v1 H7 Z", fill: "#C8961A" },
        // Hebilla de la banda
        { d: "M11,5 h2 v1 h-2 Z", fill: "#FFD700" },
        // Borde superior del tubo
        { d: "M7,0 h10 v1 H7 Z", fill: "#2A1A10" },
        // Borde inferior ala
        { d: "M3,8 h18 v1 H3 Z", fill: "#0D0805" },
        // Brillo satinado en ala izq
        { d: "M4,7 h3 v1 H4 Z", fill: "#2A2015" },
        // Brillo satinado en ala der
        { d: "M17,7 h3 v1 h-3 Z", fill: "#2A2015" },
        // Brillo satinado en cuerpo
        { d: "M8,1 h1 v5 H8 Z", fill: "#2A2015" },
      ]
    }
  },

  clothing: {
    capa_superheroe: {
      id: "capa_superheroe",
      label: "Capa de Superhéroe",
      category: "clothing",
      paths: [
        // Cuerpo del traje (debajo de la capa)
        { d: "M8,13 h8 v8 H8 Z", fill: "#1565C0" },
        // Capa trasera (roja viva) - se extiende
        { d: "M5,13 h14 v1 H5 Z M4,14 h2 v7 H4 Z M18,14 h2 v7 h-2 Z M5,14 h1 v6 H5 Z M18,14 h1 v6 h-1 Z", fill: "#D32F2F" },
        // Vuelo de la capa (trapecio irregular, efecto movimiento)
        { d: "M4,20 h3 v2 H4 Z M17,20 h3 v2 h-3 Z M5,21 h2 v2 H5 Z M17,21 h2 v2 h-2 Z", fill: "#D32F2F" },
        // Hombros de la capa (broches)
        { d: "M7,13 h1 v1 H7 Z M16,13 h1 v1 h-1 Z", fill: "#FFD700" },
        // Símbolo en el pecho
        { d: "M10,15 h4 v1 h-4 Z M11,14 h2 v3 h-2 Z", fill: "#FFD700" },
        // Cinturón
        { d: "M8,18 h8 v1 H8 Z", fill: "#FFD700" },
        // Hebilla cinturón
        { d: "M11,18 h2 v1 h-2 Z", fill: "#FFF176" },
        // Pecho del traje (azul oscuro)
        { d: "M9,13 h6 v5 H9 Z", fill: "#1565C0" },
        // Borde capa (ribete amarillo)
        { d: "M4,13 h1 v8 H4 Z M19,13 h1 v8 h-1 Z", fill: "#FFD700" },
        // Cuello
        { d: "M9,13 h6 v1 H9 Z", fill: "#0D47A1" },
        // Piernas
        { d: "M8,21 h3 v2 H8 Z M13,21 h3 v2 h-3 Z", fill: "#1565C0" },
        // Botas
        { d: "M8,22 h3 v1 H8 Z M13,22 h3 v1 h-3 Z", fill: "#D32F2F" },
      ]
    },

    traje_negocios: {
      id: "traje_negocios",
      label: "Traje Formal de Negocios",
      category: "clothing",
      paths: [
        // Chaqueta principal (gris marengo oscuro)
        { d: "M7,13 h10 v10 H7 Z", fill: "#2C3E50" },
        // Solapa izquierda
        { d: "M10,13 h2 v5 h-2 Z", fill: "#34495E" },
        // Solapa derecha
        { d: "M12,13 h2 v5 h-2 Z", fill: "#34495E" },
        // Cuello V y corbata
        { d: "M11,13 h2 v2 h-2 Z", fill: "#ECF0F1" },
        // Corbata (roja vino)
        { d: "M11,14 h2 v6 h-2 Z", fill: "#8B0000" },
        { d: "M10,19 h4 v1 h-4 Z", fill: "#6B0000" },
        // Nudo de corbata
        { d: "M11,14 h2 v1 h-2 Z", fill: "#A00000" },
        // Camisa blanca visible en puños
        { d: "M7,18 h1 v2 H7 Z M16,18 h1 v2 h-1 Z", fill: "#ECF0F1" },
        // Bolsillo pecho izq con pañuelo
        { d: "M8,15 h2 v2 H8 Z", fill: "#1A2535" },
        { d: "M8,15 h2 v1 H8 Z", fill: "#ECF0F1" },
        // Botones
        { d: "M13,16 h1 v1 h-1 Z M13,18 h1 v1 h-1 Z", fill: "#ECF0F1" },
        // Hombros (costura)
        { d: "M7,13 h3 v1 H7 Z M14,13 h3 v1 h-3 Z", fill: "#1A2535" },
        // Pantalón (negro carbón)
        { d: "M8,21 h8 v2 H8 Z", fill: "#1C1C1C" },
        // Raya del pantalón
        { d: "M11,21 h1 v2 h-1 Z M12,21 h1 v2 h-1 Z", fill: "#2A2A2A" },
        // Zapatos
        { d: "M8,22 h3 v1 H8 Z M13,22 h3 v1 h-3 Z", fill: "#0D0D0D" },
        // Brillo zapatos
        { d: "M8,22 h1 v1 H8 Z M13,22 h1 v1 h-1 Z", fill: "#2A2A2A" },
      ]
    }
  }
};

interface AvatarProps {
  baseId?: string;
  expressionId?: string;
  clothingId?: string;
  accessoryId?: string;
  className?: string;
}

export default function Avatar({ 
  baseId, 
  expressionId, 
  clothingId, 
  accessoryId, 
  className = "w-32 h-32" 
}: AvatarProps) {
  
  // Función auxiliar para buscar el asset en cualquier categoría
  const getPaths = (id?: string) => {
    if (!id) return null;
    // Buscamos en todas las categorías del objeto
    for (const category of Object.values(AVATAR_DATA)) {
      if (category[id as keyof typeof category]) {
        return (category[id as keyof typeof category] as any).paths;
      }
    }
    return null;
  };

  // Definimos el orden de las capas (IMPORTANTE para que la gorra no tape la cara)
  // 1. Base (Cuerpo)
  // 2. Ropa (Clothing)
  // 3. Expresión (Ojos/Bigote)
  // 4. Accesorios (Sombreros/Coronas)
  const layers = [baseId, clothingId, expressionId, accessoryId];

  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      style={{ 
          imageRendering: 'pixelated',
          display: 'block',
          margin: 'auto'    
        }}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {layers.map((id) => {
        const paths = getPaths(id);
        if (!paths) return null;
        
        return paths.map((p: any, index: number) => (
          <path key={`${id}-${index}`} d={p.d} fill={p.fill} />
        ));
      })}
    </svg>
  );
}