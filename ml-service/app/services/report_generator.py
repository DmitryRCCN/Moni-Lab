from fpdf import FPDF
import datetime
import pandas as pd

class MoniLabPDF(FPDF):
    def header(self):
        # Rectángulo verde de encabezado
        self.set_fill_color(16, 185, 129) # Verde Moni-Lab
        self.rect(0, 0, 210, 35, 'F')
        
        self.set_font('helvetica', 'B', 20)
        self.set_text_color(255, 255, 255)
        self.cell(0, 15, 'MONI-LAB ANALYTICS', 0, 1, 'C')
        self.set_font('helvetica', '', 11)
        self.cell(0, 5, 'Reporte Semanal de Minería de Datos Académicos', 0, 1, 'C')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Página {self.page_no()} | Generado automáticamente por ML-Service', 0, 0, 'C')

def generate_pdf(df, plot_path, recommendations):
    pdf = MoniLabPDF()
    pdf.add_page()
    
    # 1. Resumen Ejecutivo
    pdf.set_text_color(31, 41, 55) # Gris oscuro
    pdf.set_font('helvetica', 'B', 14)
    pdf.cell(0, 10, f"Resumen Ejecutivo - {datetime.date.today()}", ln=True)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)

    # 2. Tabla de Estadísticas (Calculada aquí para evitar errores de tipos)
    pdf.set_font('helvetica', 'B', 11)
    pdf.set_fill_color(243, 244, 246) # Gris muy claro
    
    # Encabezados de tabla
    pdf.cell(40, 10, "Cluster", 1, 0, 'C', True)
    pdf.cell(50, 10, "Puntaje Prom.", 1, 0, 'C', True)
    pdf.cell(50, 10, "Intentos Prom.", 1, 1, 'C', True)
    
    pdf.set_font('helvetica', '', 10)
    stats = df.groupby('cluster')[['promedio_puntaje', 'total_intentos']].mean()
    for cluster, row in stats.iterrows():
        pdf.cell(40, 10, f"Perfil {int(cluster)}", 1, 0, 'C')
        pdf.cell(50, 10, f"{row['promedio_puntaje']:.1f}", 1, 0, 'C')
        pdf.cell(50, 10, f"{row['total_intentos']:.1f}", 1, 1, 'C')

    # 3. Gráficas de Colab
    pdf.ln(10)
    pdf.set_font('helvetica', 'B', 14)
    pdf.cell(0, 10, "Evidencia de Segmentación", ln=True)
    pdf.image(plot_path, x=10, w=190)
    
    # 4. Recomendaciones
    pdf.ln(5)
    pdf.set_font('helvetica', 'B', 14)
    pdf.cell(0, 10, "Recomendaciones Estratégicas", ln=True)
    pdf.set_font('helvetica', '', 11)
    for rec in recommendations:
        pdf.multi_cell(0, 8, f"- {rec}")

    pdf_file = "reporte_analisis.pdf"
    pdf.output(pdf_file)
    return pdf_file