import { Request, Response } from 'express';
import * as service from './item.service';

export async function getItemsHandler(_req: Request, res: Response) {
  try {
    const items = await service.getAllItems();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error al obtener items' });
  }
}

export async function postPurchaseHandler(req: Request, res: Response) {
  try {
    // auth middleware añade user.userId
    const anyReq: any = req;
    const userId = anyReq.user?.userId;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? String(rawId[0]) : String(rawId);
    const result = await service.purchaseItem(String(userId), id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Error al procesar compra' });
  }
}
