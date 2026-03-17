import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_ACCESS_TOKEN;
if (!apiKey) console.warn('RESEND_API_KEY not provided — emails will fail in runtime');
const resendClient = new Resend(apiKey || '');

// AÑADIMOS EL PARÁMETRO attachments (Opcional por si se usa la función para otros correos)
export const sendMail = async (
  to: string, 
  subject: string, 
  html: string, 
  attachments?: { filename: string, content: Buffer }[] 
) => {
  try {
    const fromValue = (process.env.RESEND_FROM || 'Moni-Lab <noreply@mail.monilab.com.mx>')
      .replace(/['"]+/g, ''); 

    // Opciones base del correo
    const mailOptions: any = {
      from: fromValue,
      to,
      subject,
      html,
    };

    // Si pasamos adjuntos (como los PDFs), los agregamos a las opciones de Resend
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    const response = await resendClient.emails.send(mailOptions);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export function loadTemplate(name: string) {
  const tplPath = path.join(__dirname, '..', 'shared', 'mail', 'templates', name);
  try {
    return fs.readFileSync(tplPath, 'utf-8');
  } catch (e) {
    console.warn('Template not found:', tplPath);
    return '';
  }
}
