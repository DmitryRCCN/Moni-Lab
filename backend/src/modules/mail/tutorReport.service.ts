import { db } from '../../db/client';
import { mailService } from './mail.service';
import { sleep } from '../../utils/sleep';
import puppeteer from 'puppeteer';

/**
 * 1. Obtiene el detalle de intentos y puntajes de la última semana.
 * FILTRO: Ignora actividades con estado 'saltada' según la lógica de triggers.
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
      -- Unimos con progreso para validar el estado final
      JOIN progreso_actividad pa ON a.id_actividad = pa.id_actividad AND ia.id_usuario = pa.id_usuario
      WHERE ia.id_usuario = ? 
        AND ia.fecha_hora >= date('now', '-7 days')
        AND pa.estado != 'saltada'
      GROUP BY a.id_actividad
      ORDER BY ia.fecha_hora DESC
    `,
    args: [userId]
  });
  return result.rows;
}

/**
 * 2. Obtiene las unidades (Nodos) terminadas en la semana.
 * Determina si fue por "Salto" (examen aprobado) o "Natural".
 */
async function getWeeklyNodesCompleted(userId: string) {
  const result = await db.execute({
    sql: `
      SELECT 
        n.titulo,
        -- Si existe un examen de salto completado en este nodo, el método es 'salto'
        MAX(CASE WHEN e.es_de_salto = 1 AND pa.estado = 'completada' THEN 1 ELSE 0 END) as fue_por_salto
      FROM nodo n
      JOIN actividad a ON n.id_nodo = a.id_nodo
      JOIN progreso_actividad pa ON a.id_actividad = pa.id_actividad
      LEFT JOIN ejercicio e ON a.id_actividad = e.id_actividad
      JOIN progreso_nodo pn ON n.id_nodo = pn.id_nodo
      WHERE pa.id_usuario = ?
        AND pn.id_usuario = ?
        AND pn.estado = 'completada'
        -- Consideramos que terminó esta semana si el último intento exitoso fue en los últimos 7 días
        AND EXISTS (
          SELECT 1 FROM intento_actividad ia 
          WHERE ia.id_actividad = a.id_actividad 
          AND ia.id_usuario = ? 
          AND ia.fecha_hora >= date('now', '-7 days')
        )
      GROUP BY n.id_nodo, n.titulo
    `,
    args: [userId, userId, userId]
  });

  return result.rows.map(row => ({
    titulo: String(row.titulo),
    metodo: row.fue_por_salto === 1 ? 'salto' : 'natural'
  }));
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
  await page.setViewport({ width: 1200, height: 800 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
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
    const totalActividadesRes = await db.execute("SELECT COUNT(*) as total FROM actividad");
    const totalGlobal = Number(totalActividadesRes.rows[0].total) || 1;

    const usuariosRes = await db.execute(
      "SELECT id, email, nombre FROM usuarios WHERE email IS NOT NULL AND email != ''"
    );
    const todosLosUsuarios = usuariosRes.rows;

    const gruposPorEmail = new Map<string, any[]>();
    todosLosUsuarios.forEach((u: any) => {
      const email = u.email.toLowerCase().trim();
      if (!gruposPorEmail.has(email)) gruposPorEmail.set(email, []);
      gruposPorEmail.get(email)?.push(u);
    });

    for (const [emailTutor, estudiantes] of gruposPorEmail.entries()) {
      try {
        console.log(`Procesando grupo para: ${emailTutor} (${estudiantes.length} estudiantes)`);
        const adjuntosPdf = [];

        for (const estudiante of estudiantes) {
          const userId = String(estudiante.id);

          // A) Progreso histórico
          const completadasRes = await db.execute({
            sql: `SELECT COUNT(*) as total FROM progreso_actividad 
                  WHERE id_usuario = ? AND (estado = 'completada' OR estado = 'saltada')`,
            args: [userId]
          });
          const completadas = Number(completadasRes.rows[0].total) || 0;
          const porcentajeProgreso = Math.round((completadas / totalGlobal) * 100);

          // B) Actividad semanal (Sin SALTADAS)
          const actividadesSemanales = await getWeeklyActivityDetails(userId);

          // C) Unidades/Nodos terminados (Nuevo)
          const unidadesCompletadas = await getWeeklyNodesCompleted(userId);

          // Renderizar HTML con los nuevos datos
          const htmlReporte = await mailService.renderReportHtmlForPdf(
            estudiante.nombre,
            porcentajeProgreso,
            actividadesSemanales as any[],
            unidadesCompletadas as any[]
          );

          const pdfBuffer = await generarPdfDesdeHtml(htmlReporte);

          adjuntosPdf.push({
            filename: `Reporte_${estudiante.nombre.replace(/\s+/g, '_')}.pdf`,
            content: pdfBuffer
          });
        }

        // Enviar correo batch
        await mailService.sendTutorBatchReport(
          emailTutor,
          "Tutor de Moni-Lab", 
          adjuntosPdf
        );

        console.log(`✅ Correo enviado a ${emailTutor} con ${adjuntosPdf.length} reportes.`);

      } catch (innerError) {
        console.error(`❌ Error con el grupo ${emailTutor}:`, innerError);
      } finally {
        await sleep(1500); 
      }
    }

    console.log('--- Proceso masivo finalizado ---');
  } catch (error) {
    console.error('❌ Error crítico en el servicio de reportes:', error);
  }
}