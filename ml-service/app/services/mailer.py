import os
import resend
import base64
from dotenv import load_dotenv

load_dotenv()

# Configuramos la API Key de manera global
resend.api_key = os.getenv("RESEND_ACCESS_TOKEN")

def send_email_with_report(pdf_path):
    try:
        # 1. PROCESAMIENTO DE EMAILS (Limpieza profunda)
        raw_emails = os.getenv("ADMIN_EMAIL", "")
        clean_emails = raw_emails.replace("[", "").replace("]", "").replace("'", "").replace('"', "")
        destinatarios = [email.strip() for email in clean_emails.split(",") if email.strip()]

        # 2. PREPARACIÓN DEL ADJUNTO (Lectura en binario)
        with open(pdf_path, "rb") as f:
            pdf_data = f.read()
            # Resend SDK puede pedir el contenido como lista de bytes o base64 dependiendo de la versión
            # Lo más seguro para el SDK es enviarlo como lista de enteros o bytes directamente
            attachment_content = list(pdf_data) 

        # 3. ENVÍO USANDO EL SDK OFICIAL
        params = {
            "from": "Moni-Lab Analytics <analytics@mail.monilab.com.mx>",
            "to": destinatarios,
            "subject": "📊 Reporte de Minería de Datos - Moni-Lab",
            "html": "<strong>Hola equipo.</strong><p>El análisis de clusters está listo en el PDF adjunto.</p>",
            "attachments": [
                {
                    "filename": "Reporte_MoniLab.pdf",
                    "content": attachment_content,
                }
            ],
        }

        email = resend.Emails.send(params)
        print(f"✅ ¡Reporte enviado con éxito! ID: {email['id']}")
        return 200

    except Exception as e:
        print(f"❌ Error al enviar el reporte: {str(e)}")
        # Si es un error de dominio no verificado, aquí te lo dirá claramente
        return 500