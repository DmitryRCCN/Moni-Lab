import cron from 'node-cron';
import { db } from '../../db/client';

export function initCleanupJobs() {
  // Se ejecuta todos los días a las 00:00 (medianoche)
  // Puedes probar con '*/1 * * * *' para que corra cada 5 minutos si quieres testearlo
  cron.schedule('0 0 * * *', async () => {
    console.log('🧹 [CRON] Iniciando limpieza de refresh tokens inválidos...');
    
    try {
      const result = await db.execute({
        sql: `
          DELETE FROM refresh_tokens
          WHERE revoked = 1 
          OR expires_at < datetime('now')
        `,
        args: [],
      });

      console.log(`✅ [CRON] Limpieza completada. Filas eliminadas: ${result.rowsAffected}`);
    } catch (error) {
      console.error('❌ [CRON] Error ejecutando la limpieza de tokens:', error);
    }
  });

  console.log('🚀 [CRON] Tareas programadas de limpieza inicializadas');
}