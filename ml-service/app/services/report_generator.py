from fpdf import FPDF
import datetime

class MoniLabPDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 16)
        self.set_text_color(16, 185, 129) # Verde Moni-Lab
        self.cell(0, 10, 'MONI-LAB ANALYTICS REPORT', 0, 1, 'C')
        self.ln(10)

def generate_pdf(df, plot_path, recommendations):
    pdf = MoniLabPDF()
    pdf.add_page()
    
    # Resumen General
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, f"Fecha de emisión: {datetime.date.today()}", ln=True)
    pdf.ln(5)

    # Tabla de Clusters
    pdf.set_font('Arial', 'B', 11)
    pdf.cell(0, 10, "1. Resumen de Segmentación (K-Means)", ln=True)
    pdf.set_font('Arial', '', 10)
    resumen = df.groupby('cluster')[['promedio_puntaje', 'total_intentos']].mean()
    for cluster, row in resumen.iterrows():
        pdf.cell(0, 8, f"- Cluster {cluster}: Puntaje Prom {row['promedio_puntaje']:.1f}, Intentos Prom {row['total_intentos']:.1f}", ln=True)

    # Insertar Gráfica
    pdf.ln(5)
    pdf.image(plot_path, x=15, w=180)
    
    # Recomendaciones
    pdf.ln(10)
    pdf.set_font('Arial', 'B', 11)
    pdf.cell(0, 10, "2. Recomendaciones Estratégicas", ln=True)
    pdf.set_font('Arial', '', 10)
    for rec in recommendations:
        pdf.multi_cell(0, 8, f"* {rec}")

    pdf_file = "reporte_analisis.pdf"
    pdf.output(pdf_file)
    return pdf_file