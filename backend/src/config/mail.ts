import { Resend} from 'resend';
import { env } from '../config/env';

const resendClient = new Resend(env.RESEND_ACCESS_TOKEN);


export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const response = await resendClient.emails.send({
      from: 'Moni-Lab <onboarding@resend.dev>',
      //from: 'Moni-Lab <noreply@monilab.com>', //cambiar el dominio por el de resend o crear un subdominio para esto
      to,
      subject,
      html
    });
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
