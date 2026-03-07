from fastapi import FastAPI
from app.services.kmeans import run_analysis
from app.services.report_generator import generate_pdf
from app.services.mailer import send_email_with_report
import os

app = FastAPI(title="Moni-Lab ML Service")

@app.get("/health")
def health_check():
    return {"status": "online", "service": "ml-mining"}

@app.post("/generate-report")
def trigger_report():
    try:
        # Orquestación de procesos
        df, plot_path, recommendations = run_analysis()
        pdf_path = generate_pdf(df, plot_path, recommendations)
        status = send_email_with_report(pdf_path)
        
        # Limpieza de archivos temporales
        if os.path.exists(plot_path): os.remove(plot_path)
        if os.path.exists(pdf_path): os.remove(pdf_path)

        return {"message": "Reporte enviado con éxito", "resend_status": status}
    except Exception as e:
        return {"error": str(e)}

# Comando para correr: uvicorn app.main:app --reload