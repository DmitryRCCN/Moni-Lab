import { render } from "@react-email/render";
import WelcomeEmail from "../../shared/mail/react/templates/WelcomeEmail";
import LowPerformanceEmail from "../../shared/mail/react/templates/LowPerformanceEmail";
import TutorReportEmail from "../../shared/mail/react/templates/TutorReportEmail";
import { sendMail } from "../../config/mail";

export class MailService {

  async sendWelcomeEmail(email: string, nombre: string) {

    const html = await render(
      WelcomeEmail({ nombre: nombre.split(' ')[0] })
    );

    return sendMail(
      email,
      "Bienvenido a Moni-Lab 🎓",
      html
    );
  }
  
  async sendLowPerformance(
    email: string,
    nombre: string,
    actividad: string,
    intentos: number
  ) {

    const html = await render(
      LowPerformanceEmail({ nombre, actividad, intentos })
    );

    return sendMail(
      email,
      "Actividad difícil detectada ⚠️",
      html
    );
  }

  async sendTutorReport(
    email: string,
    nombre: string,
    progreso: number,
    actividadesSemanales: any[]
  ) {

    const html = await render(
      TutorReportEmail({
        nombre,
        progreso,
        actividadesSemanales
      })
    );

    return sendMail(
      email,
      "Reporte de progreso - Moni-Lab",
      html
    );
  }

}

export const mailService = new MailService();