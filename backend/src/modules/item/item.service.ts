import { db } from '../../db/client';
import { v4 as uuid } from 'uuid';

export async function getAllItems() {
  const res = await db.execute({
    sql: `SELECT id_item, nombre, tipo, precio, svg_capa FROM item ORDER BY nombre ASC`,
  });
  return res.rows || [];
}

export async function purchaseItem(id_usuario: string, id_item: string) {
  // Verificar existencia del item
  const itemRes = await db.execute({ sql: `SELECT precio, nombre FROM item WHERE id_item = ?`, args: [id_item] });
  if (!itemRes.rows || itemRes.rows.length === 0) throw new Error('Item no encontrado');
  const precio = itemRes.rows[0].precio ?? 0;
  const nombre = itemRes.rows[0].nombre ?? '';

  // Verificar si el usuario ya tiene el item
  const owned = await db.execute({ sql: `SELECT 1 FROM usuario_item WHERE id_usuario = ? AND id_item = ?`, args: [id_usuario, id_item] });
  if (owned.rows && owned.rows.length > 0) throw new Error('Item ya adquirido');

  // Verificar saldo
  const userRes = await db.execute({ sql: `SELECT monedas_virtuales FROM usuarios WHERE id = ?`, args: [id_usuario] });
  const monedas = userRes.rows[0]?.monedas_virtuales ?? 0;
  if (monedas < precio) throw new Error('Monedas insuficientes');

  // Realizar la compra: deducir monedas e insertar en inventario
  await db.execute({ sql: `UPDATE usuarios SET monedas_virtuales = COALESCE(monedas_virtuales,0) - ? WHERE id = ?`, args: [precio, id_usuario] });

  await db.execute({ sql: `INSERT INTO usuario_item (id_usuario, id_item, equipado) VALUES (?, ?, false)`, args: [id_usuario, id_item] });

  const updated = await db.execute({ sql: `SELECT monedas_virtuales FROM usuarios WHERE id = ?`, args: [id_usuario] });
  const monedas_restantes = updated.rows[0]?.monedas_virtuales ?? 0;

  return { id_item, nombre, precio, monedas_restantes };
}
