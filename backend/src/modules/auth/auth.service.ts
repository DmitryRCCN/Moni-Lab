export const authService = {};
import bcrypt from 'bcrypt';
import { db } from '../../db/client';
import { signToken } from '../../utils/jwt';
import { v4 as uuid } from 'uuid';

export async function registerUser(data: {
  email: string;
  password: string;
  nombre: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const id = uuid();

  await db.execute({
    sql: `
      INSERT INTO usuarios (id, email, password, nombre)
      VALUES (?, ?, ?, ?)
    `,
    args: [id, data.email, hashedPassword, data.nombre],
  });

  const token = signToken({ userId: id });

  return { token };
}

export async function loginUser(email: string, password: string) {
  const result = await db.execute({
    sql: `SELECT id, password FROM usuarios WHERE email = ?`,
    args: [email],
  });

  const user = result.rows[0];

  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password as string);

  if (!valid) throw new Error('Invalid credentials');

  const token = signToken({ userId: user.id as string });

  return { token };
}
