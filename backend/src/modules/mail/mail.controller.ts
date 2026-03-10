import { Request, Response } from 'express';
import { mailService } from './mail.service';
import { processAllTutorReports } from './tutorReport.service';

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

}

export const mailController = new MailController();