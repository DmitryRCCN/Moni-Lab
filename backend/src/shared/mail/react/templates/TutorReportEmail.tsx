import React from "react";
import { Text, Heading, Section, Row, Column } from "@react-email/components";
import EmailLayout from "../components/EmailLayout";

interface ActivityDetail {
  nombre: string;
  total_intentos: number;
  mejor_puntaje: number;
}

type Props = {
  nombre: string;
  progreso: number;
  actividadesSemanales: ActivityDetail[];
};

export default function TutorReportEmail({
  nombre,
  progreso,
  actividadesSemanales
}: Props) {
  const chartConfig = JSON.stringify({
    type: 'doughnut',
    data: {
      labels: ['Completado', 'Pendiente'],
      datasets: [{
        data: [progreso, 100 - progreso],
        backgroundColor: ['#10b981', '#e5e7eb']
      }]
    },
    options: {
      plugins: {
        datalabels: { display: false },
        doughnutlabel: {
          labels: [{ text: `${progreso}%`, font: { size: 20, weight: 'bold' } }]
        }
      }
    }
  });

  const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(chartConfig)}&w=200&h=200`;

  return (
    <EmailLayout>
      <Heading style={{ color: '#10b981', fontSize: '24px' }}>
        ¡Hola! Aquí tienes el resumen de la semana 📊
      </Heading>

      <Text>
        Esta semana, el estudiante <b>{nombre}</b> ha continuado su camino en <b>Moni-Lab</b>. 
        Aquí te presentamos el análisis de su desempeño:
      </Text>

      {/* SECCIÓN DE PROGRESO GENERAL */}
      <Section style={styles.card}>
        <Row>
          <Column style={{ width: '60%' }}>
            <Text style={styles.label}>Progreso Total del Curso</Text>
            <div style={styles.progressContainer}>
              <div style={{ ...styles.progressBar, width: `${progreso}%` }} />
            </div>
            <Text style={styles.subtext}>{progreso}% de las actividades totales completadas.</Text>
          </Column>
          <Column align="right">
            <img src={chartUrl} width="100" height="100" alt="Gráfica de progreso" />
          </Column>
        </Row>
      </Section>

      {/* SECCIÓN DE ACTIVIDAD SEMANAL */}
      <Section style={{ marginTop: '20px' }}>
        <Heading as="h3" style={{ fontSize: '18px', color: '#374151' }}>
          Actividades trabajadas esta semana
        </Heading>
        
        {actividadesSemanales.length > 0 ? (
          actividadesSemanales.map((act, i) => {
            // LÓGICA DE ALERTA: Si el mejor puntaje es menor a 60
            const necesitaRefuerzo = act.mejor_puntaje < 60;

            return (
              <div key={i} style={styles.activityRow}>
                <Row>
                  <Column>
                    <Text style={{ margin: 0, fontWeight: 'bold' }}>{act.nombre}</Text>
                    <Text style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                      Intentos realizados: {act.total_intentos}
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text style={{ 
                      margin: 0, 
                      fontWeight: 'bold', 
                      color: necesitaRefuerzo ? '#ef4444' : '#059669' 
                    }}>
                      Nota: {Math.round(act.mejor_puntaje)}/100
                    </Text>
                  </Column>
                </Row>

                {/* BLOQUE DE ALERTA ROJA */}
                {necesitaRefuerzo && (
                  <Section style={styles.alertBox}>
                    <Text style={styles.alertText}>
                      ⚠️ <b>Tópico por reforzar:</b> El estudiante ha tenido dificultades en esta actividad. ¡Un poco de práctica extra junto a ti le vendría genial!
                    </Text>
                  </Section>
                )}
              </div>
            );
          })
        ) : (
          <Text style={{ fontStyle: 'italic', color: '#9ca3af', textAlign: 'center' }}>
            No se registró actividad en la plataforma durante esta semana.
          </Text>
        )}
      </Section>

      <Text style={{ ...styles.subtext, marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        Este es un reporte automático generado por el sistema educativo de Moni-Lab.
        Si tienes dudas sobre el progreso, puedes contactar al equipo técnico.
      </Text>
    </EmailLayout>
  );
}

const styles = {
  card: {
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #f3f4f6',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: '8px',
  },
  progressContainer: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: '10px',
    height: '12px',
    overflow: 'hidden' as const,
  },
  progressBar: {
    backgroundColor: '#10b981',
    height: '100%',
  },
  subtext: {
    fontSize: '12px',
    color: '#6b7280',
  },
  activityRow: {
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  // Estilos nuevos para la alerta
  alertBox: {
    marginTop: '8px',
    padding: '10px',
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
    borderLeft: '4px solid #ef4444',
  },
  alertText: {
    margin: 0,
    fontSize: '12px',
    color: '#991b1b',
    lineHeight: '1.4',
  }
};