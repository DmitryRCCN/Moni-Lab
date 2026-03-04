import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_ACCESS_TOKEN;
if (!apiKey) console.warn('RESEND_API_KEY not provided — emails will fail in runtime');
const resendClient = new Resend(apiKey || '');

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const response = await resendClient.emails.send({
      from: process.env.RESEND_FROM || 'Moni-Lab <noreply@yourdomain.com>',
      to,
      subject,
      html,
    });
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
