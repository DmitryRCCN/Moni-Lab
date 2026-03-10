import { db } from '../../db/client';
import { mailService } from './mail.service';
import { sleep } from '../../utils/sleep';

export async function processAllTutorReports() {
  console.log('--- Iniciando envío masivo de reportes de progreso ---');
  
  try {
    // 1. Obtener el total de actividades existentes en la plataforma
    // Usamos la tabla 'actividad' según tu esquema
    const totalActividadesRes = await db.execute("SELECT COUNT(*) as total FROM actividad");
    const totalGlobal = Number(totalActividadesRes.rows[0].total) || 1;

    // 2. Obtener todos los usuarios que tienen un email registrado
    const usuariosRes = await db.execute(
      "SELECT id, email, nombre FROM usuarios WHERE email IS NOT NULL AND email != ''"
    );
    const usuarios = usuariosRes.rows;

    for (const usuario of usuarios) {
      try {
        // 3. Obtener cuántas actividades ha completado este usuario
        // Según tu esquema, esto se mira en 'progreso_actividad' con estado 'completada'
        const completadasRes = await db.execute({
          sql: `
            SELECT COUNT(*) as total 
            FROM progreso_actividad 
            WHERE id_usuario = ? AND estado = 'completada'
          `,
          args: [String(usuario.id)]
        });
        
        const completadas = Number(completadasRes.rows[0].total) || 0;
        
        // Cálculo del porcentaje
        const porcentajeProgreso = Math.round((completadas / totalGlobal) * 100);

        // 4. Enviar el reporte a través del mailService
        await mailService.sendTutorReport(
          usuario.email as string,
          usuario.nombre as string,
          porcentajeProgreso,
          completadas,
          totalGlobal
        );

        console.log(`✅ Reporte enviado: ${usuario.nombre} (${porcentajeProgreso}%)`);

      } catch (innerError) {
        console.error(`❌ Error procesando al usuario ${usuario.nombre}:`, innerError);
      } finally {
        // 5. Delay de 1 segundo para Resend
        await sleep(1000); 
      }
    }

    console.log('--- Proceso de reportes masivos finalizado ---');
  } catch (error) {
    console.error('❌ Error crítico en processAllTutorReports:', error);
  }
}