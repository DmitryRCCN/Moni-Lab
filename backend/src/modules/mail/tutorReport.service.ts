import { db } from '../../db/client';
import { mailService } from './mail.service';
import { sleep } from '../../utils/sleep';
import puppeteer from 'puppeteer';

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

async function generarPdfDesdeHtml(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
    ]
  });
  const page = await browser.newPage();
  
  // Establecer un viewport para asegurar el diseño
  await page.setViewport({ width: 1200, height: 800 });

  // Cargamos el HTML del reporte
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  // Imprimimos a PDF
  const pdfBuffer = await page.pdf({ 
    format: 'A4', 
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
  });
  
  await browser.close();
  return Buffer.from(pdfBuffer);
}

export async function processAllTutorReports() {
  console.log('--- Iniciando generación de reportes agrupados por email ---');
  
  try {
    // 1. Obtener total global de actividades
    const totalActividadesRes = await db.execute("SELECT COUNT(*) as total FROM actividad");
    const totalGlobal = Number(totalActividadesRes.rows[0].total) || 1;

    // 2. Obtener todos los usuarios que tienen un email asignado
    const usuariosRes = await db.execute(
      "SELECT id, email, nombre FROM usuarios WHERE email IS NOT NULL AND email != ''"
    );
    const todosLosUsuarios = usuariosRes.rows;

    // 3. AGRUPAR POR EMAIL
    // Creamos un mapa donde la llave es el email y el valor es la lista de usuarios (estudiantes)
    const gruposPorEmail = new Map<string, any[]>();

    todosLosUsuarios.forEach((u: any) => {
      const email = u.email.toLowerCase().trim();
      if (!gruposPorEmail.has(email)) {
        gruposPorEmail.set(email, []);
      }
      gruposPorEmail.get(email)?.push(u);
    });

    // 4. PROCESAR CADA GRUPO (Cada email recibirá un solo correo)
    for (const [emailTutor, estudiantes] of gruposPorEmail.entries()) {
      try {
        console.log(`Procesando grupo para: ${emailTutor} (${estudiantes.length} estudiantes)`);
        const adjuntosPdf = [];

        for (const estudiante of estudiantes) {
          const userId = String(estudiante.id);

          // Obtener progreso histórico
          const completadasRes = await db.execute({
            sql: `SELECT COUNT(*) as total FROM progreso_actividad 
                  WHERE id_usuario = ? AND estado = 'completada'`,
            args: [userId]
          });
          const completadas = Number(completadasRes.rows[0].total) || 0;
          const porcentajeProgreso = Math.round((completadas / totalGlobal) * 100);

          // Obtener actividad semanal
          const actividadesSemanales = await getWeeklyActivityDetails(userId);

          // Generar HTML del PDF usando la plantilla existente
          const htmlReporte = await mailService.renderReportHtmlForPdf(
            estudiante.nombre,
            porcentajeProgreso,
            actividadesSemanales as any[]
          );

          // Convertir a PDF
          const pdfBuffer = await generarPdfDesdeHtml(htmlReporte);

          adjuntosPdf.push({
            filename: `Reporte_${estudiante.nombre.replace(/\s+/g, '_')}.pdf`,
            content: pdfBuffer
          });
        }

        // 5. Enviar el correo único con todos los adjuntos
        // Usamos el nombre del primer estudiante o un genérico como "Tutor de Moni-Lab"
        await mailService.sendTutorBatchReport(
          emailTutor,
          "Tutor de Moni-Lab", 
          adjuntosPdf
        );

        console.log(`✅ Correo enviado a ${emailTutor} con ${adjuntosPdf.length} reportes.`);

      } catch (innerError) {
        console.error(`❌ Error con el grupo ${emailTutor}:`, innerError);
      } finally {
        await sleep(1500); // Pausa para no saturar Resend y el CPU
      }
    }

    console.log('--- Proceso masivo finalizado ---');
  } catch (error) {
    console.error('❌ Error crítico en el servicio de reportes:', error);
  }
}