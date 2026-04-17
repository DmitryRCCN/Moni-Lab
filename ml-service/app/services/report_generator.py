from fpdf import FPDF, XPos, YPos
import datetime
import unicodedata

# Paleta de colores Moni-Lab
MONILAB_COLORS = {
    'darkForest': (6, 78, 59),           # #064e3b
    'darkGreen': (13, 122, 102),         # #0d7a66
    'emerald': (16, 185, 129),           # #10b981
    'cyan': (6, 182, 212),               # #06b6d4
    'amber': (251, 191, 36),             # #fbbf24
    'white': (248, 250, 252),            # #f8fafc
    'lightGray': (241, 245, 249),        # #f1f5f9
    'darkGray': (51, 65, 85),            # #334155
    'textDark': (30, 41, 59),            # #1e293b
}

class MoniLabPDF(FPDF):
    def header(self):
        # Gradiente verde: darkGreen a emerald
        self.set_fill_color(*MONILAB_COLORS['darkGreen'])
        self.rect(0, 0, 210, 35, 'F')
        
        # Título
        self.set_font('Helvetica', 'B', 20)
        self.set_text_color(*MONILAB_COLORS['white'])
        self.cell(0, 15, 'MONI-LAB ANALYTICS', 0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        
        # Subtítulo
        self.set_font('Helvetica', '', 10)
        self.set_text_color(248, 250, 252)
        self.cell(0, 8, 'Educación Financiera para el Futuro', 0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(5)

def safe_str(text):
    if not text: return ""
    text = str(text)
    text = "".join(c for c in unicodedata.normalize('NFD', text)
                  if unicodedata.category(c) != 'Mn')
    return text.encode('ascii', 'ignore').decode('ascii')

def generate_pdf(df, plot_path, recommendations):
    # Márgenes
    pdf = MoniLabPDF(orientation='P', unit='mm', format='A4')
    pdf.set_margins(20, 20, 20)
    pdf.add_page()
    
    # --- SECCION 1: RESUMEN ---
    pdf.set_font('Helvetica', 'B', 14)
    pdf.set_text_color(*MONILAB_COLORS['darkGreen'])
    pdf.cell(0, 10, safe_str(f"Reporte Estratégico - {datetime.date.today()}"), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(5)

    # --- SECCION 2: GRAFICA ---
    if plot_path:
        pdf.image(plot_path, x=25, w=160) 
    pdf.ln(10)

    # --- SECCION 3: RECOMENDACIONES ---
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_fill_color(*MONILAB_COLORS['emerald'])
    pdf.set_text_color(*MONILAB_COLORS['white'])
    pdf.cell(0, 10, " Recomendaciones Estratégicas", 0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, fill=True)
    pdf.ln(2)
    
    # Recomendaciones
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(*MONILAB_COLORS['textDark'])
    
    for rec in recommendations:
        pdf.set_x(20)
        # Título de la alerta
        pdf.set_font('Helvetica', 'B', 10)
        pdf.set_text_color(*MONILAB_COLORS['darkGreen'])
        pdf.multi_cell(170, 7, safe_str(rec['mensaje']), align='L')
        
        # Evidencia (actividades)
        if rec['evidencia'] is not None:
            pdf.ln(1)
            pdf.set_font('Courier', '', 8)
            pdf.set_text_color(*MONILAB_COLORS['darkGray'])
            
            for _, row in rec['evidencia'].iterrows():
                pdf.set_x(25)
                linea = f"{row['id_actividad']:<10} {row['topico'][:20]:<25} {int(row['total_intentos']):>5} intentos {row['promedio_puntaje']:>6.1f}%"
                pdf.cell(160, 5, safe_str(linea), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            
            pdf.set_text_color(*MONILAB_COLORS['textDark'])
            pdf.ln(4)
        else:
            pdf.ln(2)

    # --- SECCION 4: TABLA DETALLADA ---
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(*MONILAB_COLORS['darkGreen'])
    pdf.cell(0, 10, "Listado Detallado de Actividades", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(5)
    
    # Encabezados (Ancho total 170mm: 20+80+35+35)
    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_fill_color(*MONILAB_COLORS['emerald'])
    pdf.set_text_color(*MONILAB_COLORS['white'])
    
    pdf.cell(20, 8, "ID", 1, new_x=XPos.RIGHT, new_y=YPos.TOP, fill=True)
    pdf.cell(80, 8, "Topico", 1, new_x=XPos.RIGHT, new_y=YPos.TOP, fill=True)
    pdf.cell(35, 8, "Intentos", 1, new_x=XPos.RIGHT, new_y=YPos.TOP, fill=True)
    pdf.cell(35, 8, "Puntaje", 1, new_x=XPos.LMARGIN, new_y=YPos.NEXT, fill=True)

    # Filas
    pdf.set_text_color(*MONILAB_COLORS['textDark'])
    pdf.set_font('Helvetica', '', 8)
    for _, row in df.sort_values('cluster').iterrows():
        pdf.set_x(20)
        pdf.cell(20, 7, safe_str(row['id_actividad']), 1, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(80, 7, safe_str(row['topico'])[:40], 1, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(35, 7, str(int(row['total_intentos'])), 1, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(35, 7, f"{row['promedio_puntaje']:.1f}", 1, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    output_path = "reporte_analisis.pdf"
    pdf.output(output_path)
    return output_path