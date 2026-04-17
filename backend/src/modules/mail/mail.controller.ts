import { Request, Response } from 'express';
import { mailService } from './mail.service';
import { processAllTutorReports } from './tutorReport.service';
import { emailPreviews, EmailPreviewType } from './mail.preview'; // BORRAR DESPUES DE PRUEBAS

export class MailController {

  async sendWelcome(req: Request, res: Response) {
    const { email, nombre } = req.body;

    try {
      await mailService.sendWelcomeEmail(email, nombre);

      res.json({ message: 'Correo de bienvenida enviado' });
    } catch (error) {
      res.status(500).json({ error: 'Error enviando correo' });
    }
  }

  async sendTest(req: Request, res: Response) {
    const { email } = req.body;

    try {
      await mailService.sendWelcomeEmail(email, 'Usuario de prueba');

      res.json({ message: 'Correo enviado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error enviando correo' });
    }
  }

  async sendTutorReports(req: Request, res: Response) {
    try {
      // Iniciamos el proceso asíncrono
      await processAllTutorReports();
      
      res.json({ 
        message: "Proceso de reportes masivos finalizado. Revisa los logs del servidor." 
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: "Error al generar los reportes", 
        details: error.message 
      });
    }
  }

  async previewEmail(req: Request, res: Response) { // BORRAR TODA LA SIGUIENTE FUNCIÓN DESPUES DE PRUEBAS
    const { type } = req.params;
    const { desarrollo } = req.query;

    try {
      // Validar que el tipo existe
      if (!(type in emailPreviews)) {
        return res.status(404).json({ 
          error: `Template no encontrado: ${type}`,
          available: Object.keys(emailPreviews)
        });
      }

      // Renderizar el email
      const html = await emailPreviews[type as EmailPreviewType]();

      // Envolver en un documento HTML completo
      const documentHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview - ${type}</title>
          <style>
            * { margin: 0; padding: 0; }
            body {
              background: linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%);
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              min-height: 100vh;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #0d7a66 0%, #10b981 100%);
              padding: 20px;
              color: white;
              text-align: center;
            }
            .header h1 {
              font-size: 18px;
              margin-bottom: 5px;
            }
            .header p {
              font-size: 12px;
              opacity: 0.9;
            }
            .preview {
              padding: 20px;
              background: white;
            }
            .code-section {
              background: #f8f9fa;
              border-top: 1px solid #e0e0e0;
              padding: 20px;
              font-size: 12px;
            }
            .code-section h3 {
              margin-bottom: 10px;
              color: #333;
            }
            .code-label {
              color: #555;
              margin-top: 10px;
              font-weight: bold;
            }
            .copy-button {
              background: #10b981;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 12px;
              margin-top: 10px;
            }
            .copy-button:hover {
              background: #059669;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Moni-Lab</h1>
              <p>Preview de Email: <strong>${type}</strong></p>
            </div>
            
            <div class="preview">
              ${html}
            </div>

            <div class="code-section">
              <h3>URL de Preview</h3>
              <code style="color: #666; padding: 10px; background: white; border: 1px solid #eee; border-radius: 4px; display: block; text-align: center; word-break: break-all;">
                http://localhost:3000/mail/preview/${type}
              </code>
              <p class="code-label">Tipos disponibles:</p>
              <code style="color: #666; display: block; white-space: pre-wrap; padding: 10px; background: white; border: 1px solid #eee; border-radius: 4px;">
${Object.keys(emailPreviews).map(k => `• ${k}`).join('\n')}
              </code>
            </div>
          </div>
        </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(documentHTML);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Error renderizando email',
        details: error.message 
      });
    }
  }

  /**
   * Endpoint para listar todos los templates disponibles en una página interactiva
   */
  async indexPreviews(req: Request, res: Response) { // BORRAR TODA LA SIGUIENTE FUNCIÓN DESPUES DE PRUEBAS
    const templates = Object.keys(emailPreviews);
    
    const htmlIndex = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Moni-Lab Email Previews</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background: linear-gradient(135deg, #064e3b 0%, #0d7a66 100%);
            min-height: 100vh;
            padding: 40px 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
          }
          .header {
            background: rgba(255,255,255,0.95);
            padding: 40px;
            border-radius: 16px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          }
          .header h1 {
            font-size: 32px;
            color: #0d7a66;
            margin-bottom: 10px;
          }
          .header p {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
          }
          .info-box {
            background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 12px;
            line-height: 1.5;
          }
          .templates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .template-card {
            background: rgba(255,255,255,0.9);
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 2px solid #f1f5f9;
          }
          .template-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            border-color: #10b981;
          }
          .template-name {
            font-size: 18px;
            font-weight: bold;
            color: #0d7a66;
            margin-bottom: 12px;
            text-transform: capitalize;
          }
          .template-desc {
            font-size: 13px;
            color: #666;
            margin-bottom: 15px;
            line-height: 1.4;
          }
          .template-link {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
          }
          .template-link:hover {
            box-shadow: 0 4px 12px rgba(16,185,129,0.3);
          }
          .footer {
            background: rgba(255,255,255,0.9);
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .footer code {
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
            color: #0d7a66;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Moni-Lab Email Previews</h1>
            <p>Visualiza todos los templates de correo sin enviar nada</p>
            <div class="info-box">
              Accede a http://localhost:3000/mail/preview/{nombre-template} para ver cada correo.
              No se envían realmente los correos, solo se renderizan para visualización.
            </div>
          </div>

          <div class="templates-grid">
            ${templates.map(template => {
              const descriptions: Record<string, string> = {
                welcome: 'Correo de bienvenida después del registro',
                confirmRegistration: 'Confirmar email con enlace JWT',
                resetPassword: 'Código de 6 dígitos para recuperar contraseña',
                lowPerformance: 'Alerta de bajo desempeño en actividades',
                confirmChange: 'Verificación de cambio de usuario/contraseña',
                tutorReport: 'Reporte semanal del progreso individual',
                tutorBatch: 'Resumen de reportes para tutores'
              };
              return `
                <div class="template-card">
                  <div class="template-name">${template}</div>
                  <div class="template-desc">${descriptions[template] || 'Email template'}</div>
                  <a href="/mail/preview/${template}" class="template-link">Ver Preview</a>
                </div>
              `;
            }).join('')}
          </div>

          <div class="footer">
            <p>💡 <strong>Tip:</strong> Usa el navegador para inspeccionar elementos y ver el HTML generado.</p>
            <p style="margin-top: 10px;">URL de lista: <code>/mail/preview</code></p>
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(htmlIndex);
  }

}

export const mailController = new MailController();