import express from 'express';
import { db } from './db/client';

const app = express();
app.use(express.json());

app.get('/health/db', async (_req, res) => {
  try {
    const result = await db.execute('SELECT 1 as ok');
    res.json({ status: 'ok', db: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'DB connection failed' });
  }
});

export default app;
