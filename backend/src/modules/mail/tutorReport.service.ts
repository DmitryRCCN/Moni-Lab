import { db } from '../../db/client';
import { mailService } from './mail.service';
import { sleep } from '../../utils/sleep';

/**
 * Obtiene el detalle de intentos y puntajes de la última semana
 */
async function getWeeklyActivityDetails(userId: string) {
  const result = await db.execute({
    sql: `
      SELECT 
        ('Ejercicio ' || n.orden_secuencial || '.' || a.orden_secuencial) as nombre,
        COUNT(ia.id_intento) as total_intentos,
        MAX(ia.puntaje_obtenido) as mejor_puntaje
      FROM intento_actividad ia
      JOIN actividad a ON ia.id_actividad = a.id_actividad
      JOIN nodo n ON a.id_nodo = n.id_nodo
      WHERE ia.id_usuario = ? 
        AND ia.fecha_hora >= date('now', '-7 days')
      GROUP BY a.id_actividad
      ORDER BY ia.fecha_hora DESC
    `,
    args: [userId]
  });
  return result.rows;
}

export async function processAllTutorReports() {
  console.log('--- Iniciando generación de reportes semanales detallados ---');
  
  try {
    // 1. Total de actividades para el cálculo de porcentaje
    const totalActividadesRes = await db.execute("SELECT COUNT(*) as total FROM actividad");
    const totalGlobal = Number(totalActividadesRes.rows[0].total) || 1;

    // 2. Usuarios con email (estudiantes)
    const usuariosRes = await db.execute(
      "SELECT id, email, nombre FROM usuarios WHERE email IS NOT NULL AND email != ''"
    );
    const usuarios = usuariosRes.rows;

    for (const usuario of usuarios) {
      try {
        const userId = String(usuario.id);

        // 3. Progreso Histórico
        const completadasRes = await db.execute({
          sql: `SELECT COUNT(*) as total FROM progreso_actividad 
                WHERE id_usuario = ? AND estado = 'completada'`,
          args: [userId]
        });
        const completadas = Number(completadasRes.rows[0].total) || 0;
        const porcentajeProgreso = Math.round((completadas / totalGlobal) * 100);

        // 4. Actividad Semanal
        const actividadesSemanales = await getWeeklyActivityDetails(userId);

        // 5. Envío
        await mailService.sendTutorReport(
          usuario.email as string,
          usuario.nombre as string,
          porcentajeProgreso,
          actividadesSemanales as any[]
        );

        console.log(`✅ Reporte enviado a: ${usuario.nombre} (${actividadesSemanales.length} activ. esta semana)`);

      } catch (innerError) {
        console.error(`❌ Error con usuario ${usuario.nombre}:`, innerError);
      } finally {
        await sleep(1000); // Respetar rate limit de Resend
      }
    }
    console.log('--- Proceso finalizado ---');
  } catch (error) {
    console.error('❌ Error crítico:', error);
  }
}