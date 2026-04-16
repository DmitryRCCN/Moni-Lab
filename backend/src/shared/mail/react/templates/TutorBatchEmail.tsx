import { Text, Heading, Section } from "@react-email/components";
import EmailLayout, { COLORS } from "../components/EmailLayout";

type Props = {
  nombreTutor: string;
  cantidadEstudiantes: number;
};

export default function TutorBatchEmail({ cantidadEstudiantes }: Props) {

  return (
    <EmailLayout title="Resumen Semanal de Reportes">
      <Section style={{ marginBottom: "20px" }}>
        <Text
          style={{
            fontSize: "16px",
            color: COLORS.textDark,
            margin: "0 0 15px 0",
            lineHeight: "1.6"
          }}
        >
          ¡Hola!,
        </Text>

        <Text
          style={{
            fontSize: "15px",
            color: COLORS.textDark,
            margin: "0 0 15px 0",
            lineHeight: "1.6"
          }}
        >
          Aquí tienes el resumen de la semana de tus estudiantes registrados en <strong>Moni-Lab</strong>.
        </Text>
      </Section>

      <Section
        style={{
          background: `linear-gradient(135deg, ${COLORS.emerald}15 0%, ${COLORS.cyan}15 100%)`,
          border: `2px solid ${COLORS.emerald}`,
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "25px",
          textAlign: "center"
        }}
      >
        <Heading
          style={{
            fontSize: "28px",
            color: COLORS.darkGreen,
            margin: "0 0 10px 0"
          }}
        >
          {cantidadEstudiantes}
        </Heading>
        <Text
          style={{
            fontSize: "14px",
            color: COLORS.textDark,
            margin: "0",
            fontWeight: "bold"
          }}
        >
          {cantidadEstudiantes === 1 ? "Reporte adjunto" : "Reportes adjuntos"}
        </Text>
      </Section>

      <Section
        style={{
          background: COLORS.lightGray,
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "20px"
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            color: COLORS.textDark,
            margin: "0 0 10px 0",
            fontWeight: "bold"
          }}
        >
          En los archivos adjuntos encontrarás:
        </Text>
        <ul style={{ margin: "10px 0", paddingLeft: "20px", fontSize: "13px", color: COLORS.textDark }}>
          <li style={{ marginBottom: "6px" }}>Progreso de cada estudiante</li>
          <li style={{ marginBottom: "6px" }}>Análisis de intentos y desempeño</li>
          <li>Áreas de oportunidad identificadas</li>
        </ul>
      </Section>

      <Section
        style={{
          background: `linear-gradient(135deg, ${COLORS.amber}15 0%, ${COLORS.emerald}15 100%)`,
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "0",
          borderLeft: `4px solid ${COLORS.amber}`
        }}
      >
        <Text
          style={{
            fontSize: "12px",
            color: COLORS.darkGray,
            margin: 0,
            lineHeight: "1.5"
          }}
        >
          <strong>Nota:</strong> Este es un correo automático generado por el sistema de Moni-Lab. Los reportes se generan cada semana para mantener un seguimiento continuo del progreso de tus estudiantes.
        </Text>
      </Section>
    </EmailLayout>
  );
}