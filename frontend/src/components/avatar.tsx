import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR DATA — viewBox="0 0 100 120"
// Orden de capas: body → base → eyes → hair/hat
// ─────────────────────────────────────────────────────────────────────────────
export const AVATAR_DATA: Record<string, Record<string, AvatarLayer>> = {

  // ══════════════════════════════════════════════════════════════════════════
  // ROPA (body)
  // ══════════════════════════════════════════════════════════════════════════
  bodies: {
    body_none: {
      id: "body_none",
      label: "Sin ropa",
      elements: [],
    },
    body_tshirt_blue: {
      id: "body_tshirt_blue",
      label: "Camiseta Azul",
      elements: [
        { type: 'rect',  x: 43, y: 82, width: 14, height: 8,  rx: 2,   fill: "#FDDBB4" },
        { type: 'path',  d: "M20,120 L20,100 Q20,90 32,88 L43,86 Q50,92 57,86 L68,88 Q80,90 80,100 L80,120 Z", fill: "#3AABCC" },
        { type: 'rect',  x: 43, y: 86, width: 14, height: 4,  rx: 0,   fill: "#2D8FA8" },
        { type: 'path',  d: "M20,102 Q26,95 34,91", fill: "none", stroke: "#2D8FA8", strokeWidth: 1.5 },
        { type: 'path',  d: "M80,102 Q74,95 66,91", fill: "none", stroke: "#2D8FA8", strokeWidth: 1.5 },
      ],
    },
    body_tshirt_green: {
      id: "body_tshirt_green",
      label: "Camiseta Verde",
      elements: [
        { type: 'rect',  x: 43, y: 82, width: 14, height: 8,  rx: 2,   fill: "#FDDBB4" },
        { type: 'path',  d: "M20,120 L20,100 Q20,90 32,88 L43,86 Q50,92 57,86 L68,88 Q80,90 80,100 L80,120 Z", fill: "#27AE60" },
        { type: 'rect',  x: 43, y: 86, width: 14, height: 4,  rx: 0,   fill: "#1E8449" },
        { type: 'path',  d: "M20,102 Q26,95 34,91", fill: "none", stroke: "#1E8449", strokeWidth: 1.5 },
        { type: 'path',  d: "M80,102 Q74,95 66,91", fill: "none", stroke: "#1E8449", strokeWidth: 1.5 },
      ],
    },
    body_tshirt_yellow: {
      id: "body_tshirt_yellow",
      label: "Camiseta Amarilla",
      elements: [
        { type: 'rect',  x: 43, y: 82, width: 14, height: 8,  rx: 2,   fill: "#FDDBB4" },
        { type: 'path',  d: "M20,120 L20,100 Q20,90 32,88 L43,86 Q50,92 57,86 L68,88 Q80,90 80,100 L80,120 Z", fill: "#F1C40F" },
        { type: 'rect',  x: 43, y: 86, width: 14, height: 4,  rx: 0,   fill: "#D4AC0D" },
        { type: 'path',  d: "M20,102 Q26,95 34,91", fill: "none", stroke: "#D4AC0D", strokeWidth: 1.5 },
        { type: 'path',  d: "M80,102 Q74,95 66,91", fill: "none", stroke: "#D4AC0D", strokeWidth: 1.5 },
      ],
    },
    body_hoodie_gray: {
      id: "body_hoodie_gray",
      label: "Sudadera Gris",
      elements: [
        { type: 'rect',  x: 43, y: 82, width: 14, height: 8,  rx: 2,   fill: "#FDDBB4" },
        { type: 'path',  d: "M20,120 L20,100 Q20,88 32,86 L43,84 Q50,90 57,84 L68,86 Q80,88 80,100 L80,120 Z", fill: "#7F8C8D" },
        { type: 'path',  d: "M34,86 Q38,78 50,76 Q62,78 66,86 Q58,82 50,80 Q42,82 34,86 Z",                   fill: "#6D7B7C" },
        { type: 'path',  d: "M40,102 Q50,100 60,102 L60,110 Q50,112 40,110 Z",                                fill: "#6D7B7C" },
        { type: 'path',  d: "M46,86 L44,96", fill: "none", stroke: "#5D6D6E", strokeWidth: 1.5 },
        { type: 'path',  d: "M54,86 L56,96", fill: "none", stroke: "#5D6D6E", strokeWidth: 1.5 },
        { type: 'path',  d: "M20,100 Q26,93 34,89", fill: "none", stroke: "#6D7B7C", strokeWidth: 1.5 },
        { type: 'path',  d: "M80,100 Q74,93 66,89", fill: "none", stroke: "#6D7B7C", strokeWidth: 1.5 },
      ],
    },
    body_jacket_leather: {
      id: "body_jacket_leather",
      label: "Chaqueta Cuero",
      elements: [
        { type: 'rect',  x: 43, y: 82, width: 14, height: 6,  rx: 2,   fill: "#FDDBB4" },
        { type: 'path',  d: "M20,120 L20,100 Q20,88 32,86 L43,84 Q50,89 57,84 L68,86 Q80,88 80,100 L80,120 Z", fill: "#1A1008" },
        { type: 'path',  d: "M43,84 Q46,88 48,96 L44,96 Q42,88 43,84 Z",                                      fill: "#2A1A10" },
        { type: 'path',  d: "M57,84 Q54,88 52,96 L56,96 Q58,88 57,84 Z",                                      fill: "#2A1A10" },
        { type: 'rect',  x: 49, y: 88, width: 2,  height: 20, rx: 1,   fill: "#C8A840" },
        { type: 'rect',  x: 48, y: 94, width: 4,  height: 3,  rx: 1,   fill: "#C8A840" },
        { type: 'path',  d: "M24,104 L36,102 L36,108 L24,110 Z",                                               fill: "#2A1A10" },
        { type: 'path',  d: "M76,104 L64,102 L64,108 L76,110 Z",                                               fill: "#2A1A10" },
        { type: 'path',  d: "M20,100 Q26,92 34,88", fill: "none", stroke: "#2A1A10", strokeWidth: 2 },
        { type: 'path',  d: "M80,100 Q74,92 66,88", fill: "none", stroke: "#2A1A10", strokeWidth: 2 },
      ],
    },
    body_suit_black: {
      id: "body_suit_black",
      label: "Traje Negro",
      elements: [
        { type: 'rect',  x: 43, y: 82, width: 14, height: 8,  rx: 2,   fill: "#FDDBB4" },
        { type: 'path',  d: "M20,120 L20,100 Q20,88 32,86 L43,84 Q50,90 57,84 L68,86 Q80,88 80,100 L80,120 Z", fill: "#1C1C2E" },
        { type: 'path',  d: "M43,84 Q46,86 50,88 Q54,86 57,84 Q54,90 50,92 Q46,90 43,84 Z",                   fill: "#F0F0F0" },
        { type: 'path',  d: "M49,88 L51,88 L52,100 L50,104 L48,100 Z",                                        fill: "#C0392B" },
        { type: 'path',  d: "M49,88 L51,88 L50,91 Z",                                                         fill: "#8B1A1A" },
        { type: 'path',  d: "M43,84 L38,92 L46,92 Z",                                                         fill: "#252540" },
        { type: 'path',  d: "M57,84 L62,92 L54,92 Z",                                                         fill: "#252540" },
        { type: 'path',  d: "M20,100 Q26,92 34,88", fill: "none", stroke: "#252540", strokeWidth: 2 },
        { type: 'path',  d: "M80,100 Q74,92 66,88", fill: "none", stroke: "#252540", strokeWidth: 2 },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BASES (tono de piel)
  // ══════════════════════════════════════════════════════════════════════════
  bases: {
    base_peach: {
      id: "base_peach",
      label: "Piel Melocotón",
      elements: [
        { type: 'path',    d: "M50,18 C28,18 22,34 22,52 C22,68 30,82 50,84 C70,82 78,68 78,52 C78,34 72,18 50,18 Z", fill: "#FDDBB4" },
        { type: 'path',    d: "M22,46 C18,46 16,50 16,54 C16,58 18,62 22,62 C22,58 21,54 22,50 Z",                    fill: "#FDDBB4" },
        { type: 'path',    d: "M78,46 C82,46 84,50 84,54 C84,58 82,62 78,62 C78,58 79,54 78,50 Z",                    fill: "#FDDBB4" },
        { type: 'path',    d: "M22,48 C19,48 17,51 17,54 C17,57 19,60 22,60",  fill: "none", stroke: "#E8A87C", strokeWidth: 1 },
        { type: 'path',    d: "M78,48 C81,48 83,51 83,54 C83,57 81,60 78,60",  fill: "none", stroke: "#E8A87C", strokeWidth: 1 },
        { type: 'ellipse', cx: 50, cy: 60, rx: 3,  ry: 2,  fill: "#E8A87C" },
        { type: 'circle',  cx: 47.5, cy: 60.5, r: 1, fill: "#D4956A" },
        { type: 'circle',  cx: 52.5, cy: 60.5, r: 1, fill: "#D4956A" },
        { type: 'ellipse', cx: 35, cy: 63, rx: 5,  ry: 3,  fill: "#F4A460", opacity: 0.35 },
        { type: 'ellipse', cx: 65, cy: 63, rx: 5,  ry: 3,  fill: "#F4A460", opacity: 0.35 },
        { type: 'path',    d: "M44,72 Q50,76 56,72", fill: "none", stroke: "#C0694A", strokeWidth: 1.5 },
      ],
    },
    base_tan: {
      id: "base_tan",
      label: "Piel Tostada",
      elements: [
        { type: 'path',    d: "M50,18 C28,18 22,34 22,52 C22,68 30,82 50,84 C70,82 78,68 78,52 C78,34 72,18 50,18 Z", fill: "#D4956A" },
        { type: 'path',    d: "M22,46 C18,46 16,50 16,54 C16,58 18,62 22,62 C22,58 21,54 22,50 Z",                    fill: "#D4956A" },
        { type: 'path',    d: "M78,46 C82,46 84,50 84,54 C84,58 82,62 78,62 C78,58 79,54 78,50 Z",                    fill: "#D4956A" },
        { type: 'path',    d: "M22,48 C19,48 17,51 17,54 C17,57 19,60 22,60",  fill: "none", stroke: "#B87040", strokeWidth: 1 },
        { type: 'path',    d: "M78,48 C81,48 83,51 83,54 C83,57 81,60 78,60",  fill: "none", stroke: "#B87040", strokeWidth: 1 },
        { type: 'ellipse', cx: 50, cy: 60, rx: 3,  ry: 2,  fill: "#B87040" },
        { type: 'circle',  cx: 47.5, cy: 60.5, r: 1, fill: "#9A5C2E" },
        { type: 'circle',  cx: 52.5, cy: 60.5, r: 1, fill: "#9A5C2E" },
        { type: 'ellipse', cx: 35, cy: 63, rx: 5,  ry: 3,  fill: "#9A5C2E", opacity: 0.3 },
        { type: 'ellipse', cx: 65, cy: 63, rx: 5,  ry: 3,  fill: "#9A5C2E", opacity: 0.3 },
        { type: 'path',    d: "M44,72 Q50,76 56,72", fill: "none", stroke: "#7A4A18", strokeWidth: 1.5 },
      ],
    },
    base_brown: {
      id: "base_brown",
      label: "Piel Morena",
      elements: [
        { type: 'path',    d: "M50,18 C28,18 22,34 22,52 C22,68 30,82 50,84 C70,82 78,68 78,52 C78,34 72,18 50,18 Z", fill: "#A0692A" },
        { type: 'path',    d: "M22,46 C18,46 16,50 16,54 C16,58 18,62 22,62 Z",                                       fill: "#A0692A" },
        { type: 'path',    d: "M78,46 C82,46 84,50 84,54 C84,58 82,62 78,62 Z",                                       fill: "#A0692A" },
        { type: 'path',    d: "M22,48 C19,48 17,51 17,54 C17,57 19,60 22,60",  fill: "none", stroke: "#7A4A18", strokeWidth: 1 },
        { type: 'path',    d: "M78,48 C81,48 83,51 83,54 C83,57 81,60 78,60",  fill: "none", stroke: "#7A4A18", strokeWidth: 1 },
        { type: 'ellipse', cx: 50, cy: 60, rx: 3,  ry: 2,  fill: "#7A4A18" },
        { type: 'circle',  cx: 47.5, cy: 60.5, r: 1, fill: "#60380E" },
        { type: 'circle',  cx: 52.5, cy: 60.5, r: 1, fill: "#60380E" },
        { type: 'ellipse', cx: 35, cy: 63, rx: 5,  ry: 3,  fill: "#60380E", opacity: 0.3 },
        { type: 'ellipse', cx: 65, cy: 63, rx: 5,  ry: 3,  fill: "#60380E", opacity: 0.3 },
        { type: 'path',    d: "M44,72 Q50,76 56,72", fill: "none", stroke: "#60380E", strokeWidth: 1.5 },
      ],
    },
    base_dark: {
      id: "base_dark",
      label: "Piel Oscura",
      elements: [
        { type: 'path',    d: "M50,18 C28,18 22,34 22,52 C22,68 30,82 50,84 C70,82 78,68 78,52 C78,34 72,18 50,18 Z", fill: "#6B3A1F" },
        { type: 'path',    d: "M22,46 C18,46 16,50 16,54 C16,58 18,62 22,62 Z",                                       fill: "#6B3A1F" },
        { type: 'path',    d: "M78,46 C82,46 84,50 84,54 C84,58 82,62 78,62 Z",                                       fill: "#6B3A1F" },
        { type: 'path',    d: "M22,48 C19,48 17,51 17,54 C17,57 19,60 22,60",  fill: "none", stroke: "#4A2410", strokeWidth: 1 },
        { type: 'path',    d: "M78,48 C81,48 83,51 83,54 C83,57 81,60 78,60",  fill: "none", stroke: "#4A2410", strokeWidth: 1 },
        { type: 'ellipse', cx: 50, cy: 60, rx: 3,  ry: 2,  fill: "#4A2410" },
        { type: 'circle',  cx: 47.5, cy: 60.5, r: 1, fill: "#3A1A08" },
        { type: 'circle',  cx: 52.5, cy: 60.5, r: 1, fill: "#3A1A08" },
        { type: 'ellipse', cx: 35, cy: 63, rx: 5,  ry: 3,  fill: "#3A1A08", opacity: 0.3 },
        { type: 'ellipse', cx: 65, cy: 63, rx: 5,  ry: 3,  fill: "#3A1A08", opacity: 0.3 },
        { type: 'path',    d: "M44,72 Q50,76 56,72", fill: "none", stroke: "#3A1A08", strokeWidth: 1.5 },
      ],
    },
    base_pale: {
      id: "base_pale",
      label: "Piel Pálida",
      elements: [
        { type: 'path',    d: "M50,18 C28,18 22,34 22,52 C22,68 30,82 50,84 C70,82 78,68 78,52 C78,34 72,18 50,18 Z", fill: "#FFE8D0" },
        { type: 'path',    d: "M22,46 C18,46 16,50 16,54 C16,58 18,62 22,62 C22,58 21,54 22,50 Z",                    fill: "#FFE8D0" },
        { type: 'path',    d: "M78,46 C82,46 84,50 84,54 C84,58 82,62 78,62 C78,58 79,54 78,50 Z",                    fill: "#FFE8D0" },
        { type: 'path',    d: "M22,48 C19,48 17,51 17,54 C17,57 19,60 22,60",  fill: "none", stroke: "#F0C8A0", strokeWidth: 1 },
        { type: 'path',    d: "M78,48 C81,48 83,51 83,54 C83,57 81,60 78,60",  fill: "none", stroke: "#F0C8A0", strokeWidth: 1 },
        { type: 'ellipse', cx: 50, cy: 60, rx: 3,  ry: 2,  fill: "#F0C8A0" },
        { type: 'circle',  cx: 47.5, cy: 60.5, r: 1, fill: "#DDA880" },
        { type: 'circle',  cx: 52.5, cy: 60.5, r: 1, fill: "#DDA880" },
        { type: 'ellipse', cx: 35, cy: 63, rx: 5,  ry: 3,  fill: "#FFB6C1", opacity: 0.5 },
        { type: 'ellipse', cx: 65, cy: 63, rx: 5,  ry: 3,  fill: "#FFB6C1", opacity: 0.5 },
        { type: 'path',    d: "M44,72 Q50,76 56,72", fill: "none", stroke: "#DDA880", strokeWidth: 1.5 },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // OJOS / LENTES / COLLARES
  // ══════════════════════════════════════════════════════════════════════════
  eyes: {
    eyes_default: {
      id: "eyes_default",
      label: "Ojos Normales",
      elements: [
        { type: 'circle', cx: 40, cy: 48, r: 6,   fill: "white" },
        { type: 'circle', cx: 60, cy: 48, r: 6,   fill: "white" },
        { type: 'circle', cx: 40, cy: 48, r: 3.5, fill: "#3D2B1F" },
        { type: 'circle', cx: 60, cy: 48, r: 3.5, fill: "#3D2B1F" },
        { type: 'circle', cx: 40, cy: 48, r: 1.8, fill: "#0D0805" },
        { type: 'circle', cx: 60, cy: 48, r: 1.8, fill: "#0D0805" },
        { type: 'circle', cx: 41.5, cy: 46.5, r: 1, fill: "white" },
        { type: 'circle', cx: 61.5, cy: 46.5, r: 1, fill: "white" },
        { type: 'path',   d: "M33,41 Q40,38 47,41", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.2, strokeLinecap: "round" },
        { type: 'path',   d: "M53,41 Q60,38 67,41", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.2, strokeLinecap: "round" },
      ],
    },
    glasses_black: {
      id: "glasses_black",
      label: "Gafas Negras",
      elements: [
        // Ojos debajo
        { type: 'circle', cx: 40, cy: 47, r: 7,   fill: "white" },
        { type: 'circle', cx: 60, cy: 47, r: 7,   fill: "white" },
        { type: 'circle', cx: 40, cy: 47, r: 4,   fill: "#2C1810" },
        { type: 'circle', cx: 60, cy: 47, r: 4,   fill: "#2C1810" },
        { type: 'circle', cx: 40, cy: 47, r: 2,   fill: "#0D0805" },
        { type: 'circle', cx: 60, cy: 47, r: 2,   fill: "#0D0805" },
        { type: 'circle', cx: 41.5, cy: 45.5, r: 1, fill: "white" },
        { type: 'circle', cx: 61.5, cy: 45.5, r: 1, fill: "white" },
        // Montura rectangular negra
        { type: 'path',   d: "M30,40 L50,40 L50,55 L30,55 Z", fill: "none", stroke: "#0D0805", strokeWidth: 3 },
        { type: 'path',   d: "M50,40 L70,40 L70,55 L50,55 Z", fill: "none", stroke: "#0D0805", strokeWidth: 3 },
        { type: 'rect',   x: 48, y: 44, width: 4,  height: 2, rx: 1, fill: "#0D0805" },
        { type: 'path',   d: "M30,47 L22,46", fill: "none", stroke: "#0D0805", strokeWidth: 2.5 },
        { type: 'path',   d: "M70,47 L78,46", fill: "none", stroke: "#0D0805", strokeWidth: 2.5 },
        // Cejas
        { type: 'path',   d: "M30,38 Q40,35 50,37", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.5, strokeLinecap: "round" },
        { type: 'path',   d: "M50,37 Q60,35 70,38", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.5, strokeLinecap: "round" },
      ],
    },
    glasses_round: {
      id: "glasses_round",
      label: "Lentes Redondos",
      elements: [
        { type: 'circle', cx: 40, cy: 47, r: 7,   fill: "white" },
        { type: 'circle', cx: 60, cy: 47, r: 7,   fill: "white" },
        { type: 'circle', cx: 40, cy: 47, r: 4.5, fill: "#2C4A6E" },
        { type: 'circle', cx: 60, cy: 47, r: 4.5, fill: "#2C4A6E" },
        { type: 'circle', cx: 40, cy: 47, r: 2.5, fill: "#0D1A28" },
        { type: 'circle', cx: 60, cy: 47, r: 2.5, fill: "#0D1A28" },
        { type: 'circle', cx: 42,  cy: 45, r: 1.2, fill: "white" },
        { type: 'circle', cx: 62,  cy: 45, r: 1.2, fill: "white" },
        { type: 'circle', cx: 40, cy: 47, r: 8,   fill: "none", stroke: "#6B3A14", strokeWidth: 2.5 },
        { type: 'circle', cx: 60, cy: 47, r: 8,   fill: "none", stroke: "#6B3A14", strokeWidth: 2.5 },
        { type: 'path',   d: "M48,46 Q50,44 52,46", fill: "none", stroke: "#6B3A14", strokeWidth: 2 },
        { type: 'path',   d: "M32,44 L22,42", fill: "none", stroke: "#6B3A14", strokeWidth: 2 },
        { type: 'path',   d: "M68,44 L78,42", fill: "none", stroke: "#6B3A14", strokeWidth: 2 },
        { type: 'path',   d: "M30,37 Q40,34 50,37", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.5, strokeLinecap: "round" },
        { type: 'path',   d: "M50,37 Q60,34 70,37", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.5, strokeLinecap: "round" },
      ],
    },
    glasses_sunglasses: {
      id: "glasses_sunglasses",
      label: "Gafas de Sol",
      elements: [
        { type: 'ellipse', cx: 40, cy: 47, rx: 10, ry: 8, fill: "#0D1A28" },
        { type: 'ellipse', cx: 60, cy: 47, rx: 10, ry: 8, fill: "#0D1A28" },
        { type: 'path',    d: "M32,43 Q36,40 42,42", fill: "none", stroke: "#1A3A5A", strokeWidth: 1.5 },
        { type: 'path',    d: "M52,43 Q56,40 62,42", fill: "none", stroke: "#1A3A5A", strokeWidth: 1.5 },
        { type: 'ellipse', cx: 40, cy: 47, rx: 10, ry: 8, fill: "none", stroke: "#080808", strokeWidth: 2.5 },
        { type: 'ellipse', cx: 60, cy: 47, rx: 10, ry: 8, fill: "none", stroke: "#080808", strokeWidth: 2.5 },
        { type: 'path',    d: "M50,46 L50,48", fill: "none", stroke: "#080808", strokeWidth: 2.5 },
        { type: 'path',    d: "M30,44 L20,42", fill: "none", stroke: "#080808", strokeWidth: 2.5 },
        { type: 'path',    d: "M70,44 L80,42", fill: "none", stroke: "#080808", strokeWidth: 2.5 },
        { type: 'path',    d: "M30,37 Q40,34 50,37", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.5, strokeLinecap: "round" },
        { type: 'path',    d: "M50,37 Q60,34 70,37", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.5, strokeLinecap: "round" },
      ],
    },
    glasses_matrix: {
      id: "glasses_matrix",
      label: "Lentes Matrix",
      elements: [
        { type: 'circle', cx: 40, cy: 47, r: 7,  fill: "#001A00" },
        { type: 'circle', cx: 60, cy: 47, r: 7,  fill: "#001A00" },
        { type: 'circle', cx: 40, cy: 47, r: 4,  fill: "#00AA00" },
        { type: 'circle', cx: 60, cy: 47, r: 4,  fill: "#00AA00" },
        { type: 'circle', cx: 40, cy: 47, r: 2,  fill: "#003300" },
        { type: 'circle', cx: 60, cy: 47, r: 2,  fill: "#003300" },
        { type: 'circle', cx: 41.5, cy: 45.5, r: 1, fill: "#00FF41" },
        { type: 'circle', cx: 61.5, cy: 45.5, r: 1, fill: "#00FF41" },
        { type: 'circle', cx: 40, cy: 47, r: 8,  fill: "none", stroke: "#00AA00", strokeWidth: 1.5 },
        { type: 'circle', cx: 60, cy: 47, r: 8,  fill: "none", stroke: "#00AA00", strokeWidth: 1.5 },
        { type: 'path',   d: "M48,47 L52,47", fill: "none", stroke: "#00AA00", strokeWidth: 1.5 },
        { type: 'path',   d: "M32,45 L22,44", fill: "none", stroke: "#00AA00", strokeWidth: 1.5 },
        { type: 'path',   d: "M68,45 L78,44", fill: "none", stroke: "#00AA00", strokeWidth: 1.5 },
        { type: 'path',   d: "M30,37 Q40,34 50,37", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.5, strokeLinecap: "round" },
        { type: 'path',   d: "M50,37 Q60,34 70,37", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.5, strokeLinecap: "round" },
      ],
    },
    necklace_gold: {
      id: "necklace_gold",
      label: "Collar Dorado",
      elements: [
        // Ojos base para que no quede la cara vacía
        { type: 'circle', cx: 40, cy: 48, r: 6,   fill: "white" },
        { type: 'circle', cx: 60, cy: 48, r: 6,   fill: "white" },
        { type: 'circle', cx: 40, cy: 48, r: 3.5, fill: "#3D2B1F" },
        { type: 'circle', cx: 60, cy: 48, r: 3.5, fill: "#3D2B1F" },
        { type: 'circle', cx: 40, cy: 48, r: 1.8, fill: "#0D0805" },
        { type: 'circle', cx: 60, cy: 48, r: 1.8, fill: "#0D0805" },
        { type: 'circle', cx: 41.5, cy: 46.5, r: 1, fill: "white" },
        { type: 'circle', cx: 61.5, cy: 46.5, r: 1, fill: "white" },
        { type: 'path',   d: "M33,41 Q40,38 47,41", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.2, strokeLinecap: "round" },
        { type: 'path',   d: "M53,41 Q60,38 67,41", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.2, strokeLinecap: "round" },
        // Collar
        { type: 'path',   d: "M36,84 Q50,90 64,84", fill: "none", stroke: "#D4A017", strokeWidth: 2.5 },
        { type: 'circle', cx: 40, cy: 86, r: 1.5, fill: "#FFD700" },
        { type: 'circle', cx: 46, cy: 88, r: 1.5, fill: "#FFD700" },
        { type: 'circle', cx: 50, cy: 89, r: 1.5, fill: "#FFD700" },
        { type: 'circle', cx: 54, cy: 88, r: 1.5, fill: "#FFD700" },
        { type: 'circle', cx: 60, cy: 86, r: 1.5, fill: "#FFD700" },
        { type: 'path',   d: "M48,89 L52,89 L54,94 L50,97 L46,94 Z", fill: "#FFD700" },
        { type: 'path',   d: "M48,89 L52,89 L50,92 Z",               fill: "#C8A010" },
        { type: 'circle', cx: 49, cy: 91, r: 1, fill: "#FFF0A0" },
      ],
    },
    necklace_pearl: {
      id: "necklace_pearl",
      label: "Collar de Perlas",
      elements: [
        { type: 'circle', cx: 40, cy: 48, r: 6,   fill: "white" },
        { type: 'circle', cx: 60, cy: 48, r: 6,   fill: "white" },
        { type: 'circle', cx: 40, cy: 48, r: 3.5, fill: "#3D2B1F" },
        { type: 'circle', cx: 60, cy: 48, r: 3.5, fill: "#3D2B1F" },
        { type: 'circle', cx: 40, cy: 48, r: 1.8, fill: "#0D0805" },
        { type: 'circle', cx: 60, cy: 48, r: 1.8, fill: "#0D0805" },
        { type: 'circle', cx: 41.5, cy: 46.5, r: 1, fill: "white" },
        { type: 'circle', cx: 61.5, cy: 46.5, r: 1, fill: "white" },
        { type: 'path',   d: "M33,41 Q40,38 47,41", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.2, strokeLinecap: "round" },
        { type: 'path',   d: "M53,41 Q60,38 67,41", fill: "none", stroke: "#3D1F0A", strokeWidth: 2.2, strokeLinecap: "round" },
        // Perlas
        { type: 'path',   d: "M34,83 Q50,90 66,83", fill: "none", stroke: "#D0C0A8", strokeWidth: 0.8 },
        { type: 'circle', cx: 36, cy: 83, r: 2.5, fill: "#F5F0EA" },
        { type: 'circle', cx: 41, cy: 86, r: 2.5, fill: "#F5F0EA" },
        { type: 'circle', cx: 46, cy: 88, r: 2.5, fill: "#F5F0EA" },
        { type: 'circle', cx: 50, cy: 89, r: 2.5, fill: "#F5F0EA" },
        { type: 'circle', cx: 54, cy: 88, r: 2.5, fill: "#F5F0EA" },
        { type: 'circle', cx: 59, cy: 86, r: 2.5, fill: "#F5F0EA" },
        { type: 'circle', cx: 64, cy: 83, r: 2.5, fill: "#F5F0EA" },
        { type: 'circle', cx: 35, cy: 82, r: 0.8, fill: "white" },
        { type: 'circle', cx: 40, cy: 85, r: 0.8, fill: "white" },
        { type: 'circle', cx: 45, cy: 87, r: 0.8, fill: "white" },
        { type: 'circle', cx: 50, cy: 88, r: 0.8, fill: "white" },
        { type: 'circle', cx: 55, cy: 87, r: 0.8, fill: "white" },
        { type: 'circle', cx: 60, cy: 85, r: 0.8, fill: "white" },
        { type: 'circle', cx: 65, cy: 82, r: 0.8, fill: "white" },
        { type: 'rect',   x: 33, y: 81, width: 4, height: 3, rx: 1.5, fill: "#C8A840" },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CABELLO / GORROS
  // ══════════════════════════════════════════════════════════════════════════
  hair: {
    hair_none: {
      id: "hair_none",
      label: "Sin cabello",
      elements: [],
    },
    hair_quiff: {
      id: "hair_quiff",
      label: "Quiff Castaño",
      elements: [
        { type: 'path', d: "M22,44 C22,34 28,20 50,18 C72,20 78,34 78,44 C74,36 68,28 60,24 C54,20 46,20 40,24 C32,28 26,36 22,44 Z",  fill: "#3D1F0A" },
        { type: 'path', d: "M26,42 C26,32 32,22 50,20 C68,22 74,32 74,42 C70,34 64,26 56,23 C50,20 44,21 38,24 C30,28 26,34 26,42 Z",  fill: "#5C3A14" },
        { type: 'path', d: "M38,28 C40,20 44,14 50,12 C56,14 60,20 62,28 C58,22 54,18 50,16 C46,18 42,22 38,28 Z",                    fill: "#3D1F0A" },
        { type: 'path', d: "M40,28 C42,21 46,15 50,13 C54,15 58,21 60,28 C56,23 52,19 50,18 C48,19 44,23 40,28 Z",                    fill: "#5C3A14" },
        { type: 'path', d: "M44,18 C47,15 53,15 56,18 C53,16 47,16 44,18 Z",                                                          fill: "#8A5C28" },
        { type: 'path', d: "M22,44 C22,38 24,32 28,28 C26,34 24,40 24,48 Z",                                                          fill: "#3D1F0A" },
        { type: 'path', d: "M78,44 C78,38 76,32 72,28 C74,34 76,40 76,48 Z",                                                          fill: "#3D1F0A" },
      ],
    },
    hair_bob_black: {
      id: "hair_bob_black",
      label: "Bob Negro",
      elements: [
        { type: 'path', d: "M22,52 C22,36 28,20 50,18 C72,20 78,36 78,52 C78,44 76,34 72,28 C66,22 58,18 50,18 C42,18 34,22 28,28 C24,34 22,44 22,52 Z", fill: "#1A0A00" },
        { type: 'path', d: "M28,34 C30,26 38,20 50,18 C62,20 70,26 72,34 C66,30 58,26 50,26 C42,26 34,30 28,34 Z",                                       fill: "#0D0500" },
        { type: 'rect', x: 22, y: 34, width: 6, height: 26, rx: 3, fill: "#1A0A00" },
        { type: 'rect', x: 72, y: 34, width: 6, height: 26, rx: 3, fill: "#1A0A00" },
        { type: 'path', d: "M38,20 C44,17 56,17 62,20 C56,18 44,18 38,20 Z",                                                                             fill: "#3D2010" },
      ],
    },
    hair_curly_red: {
      id: "hair_curly_red",
      label: "Rizado Rojo",
      elements: [
        { type: 'path',   d: "M22,46 C20,36 24,22 38,18 C44,16 56,16 62,18 C76,22 80,36 78,46 C76,36 70,26 60,22 C54,18 46,18 40,22 C30,26 24,36 22,46 Z", fill: "#8B1A00" },
        { type: 'circle', cx: 36, cy: 22, r: 5,   fill: "#C0392B" },
        { type: 'circle', cx: 44, cy: 17, r: 5.5, fill: "#C0392B" },
        { type: 'circle', cx: 50, cy: 15, r: 5,   fill: "#C0392B" },
        { type: 'circle', cx: 56, cy: 17, r: 5.5, fill: "#C0392B" },
        { type: 'circle', cx: 64, cy: 22, r: 5,   fill: "#C0392B" },
        { type: 'circle', cx: 26, cy: 34, r: 4,   fill: "#C0392B" },
        { type: 'circle', cx: 74, cy: 34, r: 4,   fill: "#C0392B" },
        { type: 'circle', cx: 24, cy: 44, r: 3.5, fill: "#C0392B" },
        { type: 'circle', cx: 76, cy: 44, r: 3.5, fill: "#C0392B" },
        { type: 'circle', cx: 44, cy: 16, r: 2,   fill: "#E8604A" },
        { type: 'circle', cx: 56, cy: 16, r: 2,   fill: "#E8604A" },
      ],
    },
    hat_beanie: {
      id: "hat_beanie",
      label: "Gorro Lana",
      elements: [
        { type: 'path', d: "M24,38 C22,28 28,16 50,14 C72,16 78,28 76,38 C72,30 64,22 50,20 C36,22 28,30 24,38 Z",        fill: "#2980B9" },
        { type: 'path', d: "M22,42 L22,36 C24,26 32,16 50,14 C68,16 76,26 78,36 L78,42 C74,34 64,26 50,24 C36,26 26,34 22,42 Z", fill: "#2980B9" },
        { type: 'path', d: "M20,42 Q50,50 80,42 L80,46 Q50,54 20,46 Z",                                                   fill: "#1A6090" },
        { type: 'path', d: "M26,30 Q50,26 74,30", fill: "none", stroke: "#1A6090", strokeWidth: 1.5 },
        { type: 'path', d: "M22,38 Q50,34 78,38", fill: "none", stroke: "#1A6090", strokeWidth: 1.5 },
        { type: 'circle', cx: 50, cy: 12, r: 5,   fill: "#ECF0F1" },
        { type: 'circle', cx: 48, cy: 10, r: 2,   fill: "#BDC3C7" },
        { type: 'circle', cx: 52, cy: 11, r: 1.5, fill: "#BDC3C7" },
      ],
    },
    hat_cowboy: {
      id: "hat_cowboy",
      label: "Sombrero Vaquero",
      elements: [
        { type: 'path', d: "M12,36 Q30,40 50,38 Q70,40 88,36 L86,40 Q68,44 50,42 Q32,44 14,40 Z", fill: "#8B6914" },
        { type: 'path', d: "M28,36 C26,28 28,16 50,14 C72,16 74,28 72,36 C68,30 60,24 50,22 C40,24 32,30 28,36 Z",        fill: "#A0821E" },
        { type: 'path', d: "M36,22 C38,16 44,12 50,12 C56,12 62,16 64,22 C60,18 54,14 50,14 C46,14 40,18 36,22 Z",        fill: "#8B6914" },
        { type: 'path', d: "M28,36 Q50,34 72,36 Q70,38 50,36 Q30,38 28,36 Z",                                             fill: "#6B4A08" },
        { type: 'path', d: "M36,22 C40,18 46,16 52,16 C48,15 42,17 36,22 Z",                                              fill: "#C8A040" },
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE AVATAR
// ─────────────────────────────────────────────────────────────────────────────
export interface AvatarEquipped {
  bodyId?:  string;   // ropa
  baseId?:  string;   // tono de piel
  eyesId?:  string;   // ojos / lentes / collar
  hairId?:  string;   // cabello / gorro
}

interface AvatarProps extends AvatarEquipped {
  size?:      number;
  className?: string;
}

export default function Avatar({
  bodyId  = "body_tshirt_blue",
  baseId  = "base_peach",
  eyesId  = "eyes_default",
  hairId  = "hair_quiff",
  size,
  className = "w-32 h-32",
}: AvatarProps) {
  // Orden de renderizado (de abajo hacia arriba):
  // 1. body  — ropa (queda detrás de la piel)
  // 2. base  — cara y piel
  // 3. eyes  — ojos, lentes, collar (sobre la cara)
  // 4. hair  — cabello o gorro (encima de todo)
  const layerIds = [bodyId, baseId, eyesId, hairId];

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
      {layerIds.map((id) => {
        const layer = findLayer(id);
        if (!layer) return null;
        return layer.elements.map((el, i) => renderElement(el, `${id}-${i}`));
      })}
    </svg>
  );
}