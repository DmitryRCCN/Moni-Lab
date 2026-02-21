import { Request, Response } from 'express';
import { getAllNodos, createNodo } from './nodo.service';

export async function listNodos(_req: Request, res: Response) {
  try {
    const nodos = await getAllNodos();
    res.json(nodos);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error obteniendo nodos' });
  }
}

export async function createNodoHandler(req: Request, res: Response) {
  try {
    const body = req.body;
    if (!body?.titulo || !body?.orden_secuencial || !body?.topico) {
      return res.status(400).json({ error: 'Campos requeridos: titulo, orden_secuencial, topico' });
    }
    const created = await createNodo({ titulo: body.titulo, descripcion: body.descripcion, orden_secuencial: Number(body.orden_secuencial), topico: body.topico });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error creando nodo' });
  }
}
