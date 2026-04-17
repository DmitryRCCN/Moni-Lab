import { Text, Heading, Section, Row, Column } from "@react-email/components";
import EmailLayout, { COLORS } from "../components/EmailLayout";

interface ActivityDetail {
  nombre: string;
  total_intentos: number;
  mejor_puntaje: number;
}

interface UnidadCompletada {
  titulo: string;
  metodo: 'natural' | 'salto';
}

type Props = {
  nombre: string;
  progreso: number;
  actividadesSemanales: ActivityDetail[];
  unidadesCompletadas: UnidadCompletada[];
};

export default function TutorReportEmail({
  nombre,
  progreso,
  actividadesSemanales,
  unidadesCompletadas
}: Props) {
  const chartConfig = JSON.stringify({
    type: 'doughnut',
    data: {
      labels: ['Completado', 'Pendiente'],
      datasets: [{
        data: [progreso, 100 - progreso],
        backgroundColor: [COLORS.emerald, COLORS.mediumGray]
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
    <EmailLayout title="Resumen Semanal de Progreso">
      <Section style={{ marginBottom: "20px" }}>
        <Text
          style={{
            fontSize: "16px",
            color: COLORS.textDark,
            margin: "0 0 15px 0",
            lineHeight: "1.6"
          }}
        >
          El estudiante <strong>{nombre}</strong> ha continuado su camino en <strong>Moni-Lab</strong>. Aquí te presentamos el análisis detallado de su desempeño:
        </Text>
      </Section>

      {/* SECCIÓN DE PROGRESO GENERAL */}
      <Section style={styles.card}>
        <Row>
          <Column style={{ width: "60%" }}>
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

      {/* SECCIÓN DE UNIDADES COMPLETADAS */}
      {unidadesCompletadas && unidadesCompletadas.length > 0 && (
        <Section style={{ marginTop: "20px" }}>
          <Heading
            style={{
              fontSize: "18px",
              color: COLORS.darkGreen,
              margin: "0 0 15px 0",
              fontWeight: "bold"
            }}
          >
            Unidades Dominadas esta Semana
          </Heading>
          {unidadesCompletadas.map((unidad, i) => (
            <div key={i} style={{ ...styles.card, marginBottom: "10px", borderLeft: `4px solid ${COLORS.amber}` }}>
              <Text style={{ margin: 0, fontWeight: "bold", color: COLORS.emerald }}>
                {unidad.titulo}
              </Text>
              <Text style={{ margin: "4px 0 0 0", fontSize: "13px", color: COLORS.darkGray, lineHeight: "1.4" }}>
                {unidad.metodo === "salto"
                  ? "Aprobada por Reto de Salto. Evidencia de dominio previo validada."
                  : "Completada paso a paso de manera natural."}
              </Text>
            </div>
          ))}
        </Section>
      )}

      {/* SECCIÓN DE ACTIVIDAD SEMANAL */}
      <Section style={{ marginTop: "20px" }}>
        <Heading
          style={{
            fontSize: "18px",
            color: COLORS.darkGreen,
            margin: "0 0 15px 0",
            fontWeight: "bold"
          }}
        >
          Actividades Trabajadas esta Semana
        </Heading>

        {actividadesSemanales && actividadesSemanales.length > 0 ? (
          actividadesSemanales.map((act, i) => {
            const necesitaRefuerzo = act.mejor_puntaje < 60;

            return (
              <div key={i} style={styles.activityRow}>
                <Row>
                  <Column>
                    <Text style={{ margin: 0, fontWeight: "bold", color: COLORS.textDark }}>
                      {act.nombre}
                    </Text>
                    <Text style={{ margin: "4px 0 0 0", fontSize: "12px", color: COLORS.darkGray }}>
                      Intentos: {act.total_intentos}
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text
                      style={{
                        margin: 0,
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: necesitaRefuerzo ? "#dc2626" : COLORS.emerald
                      }}
                    >
                      {Math.round(act.mejor_puntaje)}%
                    </Text>
                  </Column>
                </Row>

                {/* BLOQUE DE ALERTA */}
                {necesitaRefuerzo && (
                  <Section style={styles.alertBox}>
                    <Text style={styles.alertText}>
                      Tópico por reforzar: El estudiante ha tenido dificultades. Un poco de práctica extra junto a ti le vendría bien.
                    </Text>
                  </Section>
                )}
              </div>
            );
          })
        ) : (
          <Text
            style={{
              fontStyle: "italic",
              color: COLORS.darkGray,
              textAlign: "center",
              margin: "20px 0"
            }}
          >
            No se registró actividad durante esta semana.
          </Text>
        )}
      </Section>

      <Section
        style={{
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: `1px solid ${COLORS.mediumGray}`
        }}
      >
        <Text
          style={{
            fontSize: "11px",
            color: COLORS.darkGray,
            margin: 0,
            lineHeight: "1.5"
          }}
        >
          Este es un reporte automático generado por el sistema educativo de Moni-Lab. Si tienes dudas sobre el progreso, contacta al equipo técnico.
        </Text>
      </Section>
    </EmailLayout>
  );
}

const styles = {
  card: {
    padding: "20px",
    backgroundColor: COLORS.lightGray,
    borderRadius: "12px",
    border: `1px solid ${COLORS.mediumGray}`,
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold" as const,
    color: COLORS.darkGreen,
    marginBottom: "8px",
  },
  progressContainer: {
    width: "100%",
    backgroundColor: COLORS.mediumGray,
    borderRadius: "10px",
    height: "12px",
    overflow: "hidden" as const,
  },
  progressBar: {
    backgroundColor: COLORS.emerald,
    height: "100%",
  },
  subtext: {
    fontSize: "12px",
    color: COLORS.darkGray,
  },
  activityRow: {
    padding: "12px 0",
    borderBottom: `1px solid ${COLORS.mediumGray}`,
  },
  alertBox: {
    marginTop: "8px",
    padding: "10px",
    backgroundColor: `${COLORS.amber}15`,
    borderRadius: "8px",
    borderLeft: `4px solid ${COLORS.amber}`,
  },
  alertText: {
    margin: 0,
    fontSize: "12px",
    color: COLORS.darkGray,
    lineHeight: "1.4" as const,
  }
};