from fpdf import FPDF
import datetime
import unicodedata

class MoniLabPDF(FPDF):
    def header(self):
        self.set_fill_color(16, 185, 129) 
        self.rect(0, 0, 210, 35, 'F')
        self.set_font('Arial', 'B', 20)
        self.set_text_color(255, 255, 255)
        self.cell(0, 15, 'MONI-LAB ANALYTICS', 0, 1, 'C')
        self.ln(10)

def safe_str(text):
    if not text: return ""
    text = str(text)
    text = "".join(c for c in unicodedata.normalize('NFD', text)
                  if unicodedata.category(c) != 'Mn')
    return text.encode('ascii', 'ignore').decode('ascii')

def generate_pdf(df, plot_path, recommendations):
    # Margen de 20mm para dar mucho espacio
    pdf = MoniLabPDF(orientation='P', unit='mm', format='A4')
    pdf.set_margins(20, 20, 20)
    pdf.add_page()
    
    # --- SECCION 1: RESUMEN ---
    pdf.set_font('Arial', 'B', 14)
    pdf.set_text_color(31, 41, 55)
    pdf.cell(0, 10, safe_str(f"Reporte Estrategico - {datetime.date.today()}"), ln=1)
    pdf.ln(5)

    # --- SECCION 2: GRAFICA ---
    if plot_path:
        # Centramos la imagen manualmente
        pdf.image(plot_path, x=25, w=160) 
    pdf.ln(10)

    # --- SECCION 3: RECOMENDACIONES (CORREGIDO) ---
    pdf.set_font('Arial', 'B', 12)
    pdf.set_fill_color(240, 240, 240)
    pdf.cell(0, 10, " Recomendaciones Estrategicas:", ln=1, fill=True)
    pdf.ln(2)
    
    pdf.set_font('Arial', '', 10)
    pdf.set_text_color(50, 50, 50)
    
    for rec in recommendations:
        pdf.set_x(20)
        # Título de la alerta
        pdf.set_font('Arial', 'B', 10)
        pdf.multi_cell(170, 7, safe_str(rec['mensaje']), align='L')
        
        # Si hay evidencia (actividades que triggerearon la alerta)
        if rec['evidencia'] is not None:
            pdf.ln(1)
            pdf.set_font('Courier', '', 8)
            pdf.set_text_color(100, 100, 100)
            
            # Dibujar sub-tabla de evidencia
            for _, row in rec['evidencia'].iterrows():
                pdf.set_x(25) # Un poco más de sangría
                linea = f"{row['id_actividad']:<10} {row['topico'][:20]:<25} {int(row['total_intentos']):>5} intentos {row['promedio_puntaje']:>6.1f}%"
                pdf.cell(160, 5, safe_str(linea), ln=1)
            
            pdf.set_text_color(0, 0, 0) # Reset color
            pdf.ln(4)
        else:
            pdf.ln(2)

    # --- SECCION 4: TABLA ---
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.set_text_color(31, 41, 55)
    pdf.cell(0, 10, "Listado Detallado de Actividades", ln=1)
    pdf.ln(5)
    
    # Encabezados (Ancho total 170mm: 20+80+35+35)
    pdf.set_font('Arial', 'B', 9)
    pdf.set_fill_color(16, 185, 129)
    pdf.set_text_color(255, 255, 255)
    
    pdf.cell(20, 8, "ID", 1, 0, 'C', True)
    pdf.cell(80, 8, "Topico", 1, 0, 'C', True)
    pdf.cell(35, 8, "Intentos", 1, 0, 'C', True)
    pdf.cell(35, 8, "Puntaje", 1, 1, 'C', True)

    # Filas
    pdf.set_text_color(0, 0, 0)
    pdf.set_font('Arial', '', 8)
    for _, row in df.sort_values('cluster').iterrows():
        pdf.set_x(20) # Reset X por seguridad en cada fila
        pdf.cell(20, 7, safe_str(row['id_actividad']), 1, 0, 'C')
        pdf.cell(80, 7, safe_str(row['topico'])[:40], 1, 0, 'L')
        pdf.cell(35, 7, str(int(row['total_intentos'])), 1, 0, 'C')
        pdf.cell(35, 7, f"{row['promedio_puntaje']:.1f}", 1, 1, 'C')

    output_path = "reporte_analisis.pdf"
    pdf.output(output_path)
    return output_path