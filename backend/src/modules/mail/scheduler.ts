import cron from 'node-cron';
import { processAllTutorReports } from './tutorReport.service';

export function initMailScheduler() {
  // Ejemplo: Se ejecuta cada Lunes a las 8:00 AM
  // Formato: (Minuto Hora DíaMes Mes DíaSemana)
  cron.schedule('0 8 * * 1', async () => {
    console.log('⏰ Ejecutando tarea programada de reportes...');
    await processAllTutorReports();
  }, {
    scheduled: true,
    timezone: "America/Mexico_City"
  });

  console.log('🚀 Scheduler de correos inicializado correctamente.');
}