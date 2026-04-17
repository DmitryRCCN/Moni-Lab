import React from "react";
import { Text, Heading, Section } from "@react-email/components";
import EmailLayout, { COLORS } from "../components/EmailLayout";

type Props = {
  nombre: string;
  actividad: string;
  intentos: number;
};

export default function LowPerformanceEmail({
  nombre,
  actividad,
  intentos
}: Props) {
  const nombrePrimero = nombre.split(' ')[0];

  return (
    <EmailLayout title="Refuerzo Recomendado">
      <Section style={{ marginBottom: "20px" }}>
        <Text
          style={{
            fontSize: "16px",
            color: COLORS.textDark,
            margin: "0 0 15px 0",
            lineHeight: "1.6"
          }}
        >
          Hola <strong>{nombrePrimero}</strong>,
        </Text>
      </Section>

      <Section
        style={{
          background: `linear-gradient(135deg, ${COLORS.amber}20 0%, ${COLORS.emerald}20 100%)`,
          border: `2px solid ${COLORS.amber}`,
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px"
        }}
      >
        <Text
          style={{
            fontSize: "15px",
            color: COLORS.textDark,
            margin: "0",
            lineHeight: "1.6"
          }}
        >
          Hemos notado que en la actividad <strong>{actividad}</strong> requirió <strong>{intentos} intentos</strong> para completarse.
        </Text>
      </Section>

      <Section style={{ marginBottom: "20px" }}>
        <Heading
          style={{
            fontSize: "18px",
            color: COLORS.darkGreen,
            margin: "0 0 10px 0"
          }}
        >
          Recomendación
        </Heading>
        <Text style={{ fontSize: "14px", color: COLORS.textDark, margin: 0, lineHeight: "1.5" }}>
          Te recomendamos repasar el tema correspondiente antes de continuar con las siguientes actividades. Esto te ayudará a consolidar los conceptos y ahorrar tiempo en futuros desafíos.
        </Text>
      </Section>

      <Section
        style={{
          background: COLORS.lightGray,
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "20px",
          borderLeft: `4px solid ${COLORS.emerald}`
        }}
      >

        <Text
          style={{
            fontSize: "13px",
            color: COLORS.textDark,
            margin: "0 0 8px 0",
            lineHeight: "1.5",
            fontWeight: "bold"
          }}
        >
          Beneficios de repasar:
          <Section>
            <ul style={{ margin: "8px 0", paddingLeft: "20px", fontSize: "13px", color: COLORS.textDark }}>
              <li style={{ marginBottom: "4px" }}>Mejor comprensión del tema</li>
              <li style={{ marginBottom: "4px" }}>Bonus de monedas por completar</li>
              <li>Mayor confianza en actividades futuras</li>
            </ul>
          </Section>
        </Text>

      </Section>

      <Section
        style={{
          background: `linear-gradient(135deg, ${COLORS.emerald}15 0%, ${COLORS.cyan}15 100%)`,
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "0",
          borderLeft: `4px solid ${COLORS.cyan}`
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
          <strong>Recuerda:</strong> Aprender toma práctica. Todos los estudiantes avanzan a su propio ritmo. ¡Sigue adelante, tú puedes!
        </Text>
      </Section>
    </EmailLayout>
  );
}