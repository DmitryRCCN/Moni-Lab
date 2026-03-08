import { Request, Response } from 'express';
import { mailService } from './mail.service';

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

}

export const mailController = new MailController();