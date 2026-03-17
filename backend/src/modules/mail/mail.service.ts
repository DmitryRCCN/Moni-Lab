import { render } from "@react-email/render";
import WelcomeEmail from "../../shared/mail/react/templates/WelcomeEmail";
import LowPerformanceEmail from "../../shared/mail/react/templates/LowPerformanceEmail";
import TutorReportEmail from "../../shared/mail/react/templates/TutorReportEmail";
import TutorBatchEmail from "../../shared/mail/react/templates/TutorBatchEmail";
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

  async renderReportHtmlForPdf(
    nombreEstudiante: string,
    progreso: number,
    actividadesSemanales: any[]
  ): Promise<string> {
    return await render(
      TutorReportEmail({
        nombre: nombreEstudiante,
        progreso,
        actividadesSemanales
      })
    );
  }

// Esta es la nueva función que envía el correo global al tutor con los PDFs
  async sendTutorBatchReport(
    emailTutor: string,
    nombreTutor: string,
    adjuntosPdf: { filename: string; content: Buffer }[]
  ) {
    const html = await render(
      TutorBatchEmail({
        nombreTutor,
        cantidadEstudiantes: adjuntosPdf.length
      })
    );

    // Asegúrate de que tu función 'sendMail' en config/mail soporte recibir el 4to parámetro (attachments)
    return sendMail(
      emailTutor,
      `Reporte Semanal de Estudiantes - Moni-Lab 📊`,
      html,
      adjuntosPdf // Pasamos los adjuntos a tu configurador de correo
    );
  }
}

export const mailService = new MailService();