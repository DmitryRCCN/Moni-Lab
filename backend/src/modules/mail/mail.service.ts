import { render } from "@react-email/render";
import WelcomeEmail from "../../shared/mail/react/templates/WelcomeEmail";
import LowPerformanceEmail from "../../shared/mail/react/templates/LowPerformanceEmail";
import TutorReportEmail from "../../shared/mail/react/templates/TutorReportEmail";
import TutorBatchEmail from "../../shared/mail/react/templates/TutorBatchEmail";
import ConfirmChangeEmail from "../../shared/mail/react/templates/ConfirmChangeEmail";
import ResetPasswordEmail from "../../shared/mail/react/templates/ResetPasswordEmail";
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
    nombre: string,
    porcentajeProgreso: number,
    actividadesSemanales: any[],
    unidadesCompletadas: any[] // <--- Agregamos el cuarto argumento aquí
  ): Promise<string> {
    return await render(
      TutorReportEmail({
        nombre,
        progreso: porcentajeProgreso,
        actividadesSemanales,
        unidadesCompletadas, // <--- Lo pasamos a la plantilla
      })
    );
  }

// Envía el correo global al tutor con los PDFs
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

  async sendConfirmUpdateEmail(
    email: string, 
    nombreActual: string, 
    nuevoNombre: string, 
    token: string, 
    cambiaPass: boolean
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const confirmLink = `${frontendUrl}/confirm-update?token=${token}`;
    
    const html = await render(
      ConfirmChangeEmail({ 
        nombreActual, 
        nuevoNombre, 
        link: confirmLink, 
        cambiaPass 
      })
    );

    return sendMail(email, "Confirma tus cambios de perfil 🛡️", html);
  }

  async sendResetPasswordEmail(email: string, nombre: string, code: string) {
    const html = await render(ResetPasswordEmail({ nombre, code }));
    return sendMail(email, "Código de recuperación 🔑", html);
  }
}

export const mailService = new MailService();