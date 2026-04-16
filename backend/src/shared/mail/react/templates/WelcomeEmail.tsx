import React from "react";
import { Text, Heading, Section, Button } from "@react-email/components";
import EmailLayout, { COLORS } from "../components/EmailLayout";

type Props = {
  nombre: string;
};

export default function WelcomeEmail({ nombre }: Props) {
  const nombrePrimero = nombre.split(' ')[0];

  return (
    <EmailLayout title={`Bienvenido, ${nombrePrimero}`}>
      <Section style={{ marginBottom: "20px" }}>
        <Text
          style={{
            fontSize: "16px",
            color: COLORS.textDark,
            margin: "0 0 15px 0",
            lineHeight: "1.6"
          }}
        >
          Gracias por registrarte en <strong>Moni-Lab</strong>. Estamos emocionados de que te unas a nuestra comunidad de educación financiera.
        </Text>
      </Section>

      <Section
        style={{
          background: `linear-gradient(135deg, ${COLORS.amber}20 0%, ${COLORS.emerald}20 100%)`,
          border: `1px solid ${COLORS.mediumGray}`,
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          textAlign: "center"
        }}
      >
        <Heading
          style={{
            fontSize: "18px",
            color: COLORS.darkGreen,
            margin: "0 0 10px 0"
          }}
        >
          Ya puedes comenzar
        </Heading>
        <Text style={{ fontSize: "14px", color: COLORS.textDark, margin: 0, lineHeight: "1.5" }}>
          Tu cuenta está lista. Accede a lecciones interactivas, juegos educativos y desafíos financieros diseñados especialmente para ti.
        </Text>
      </Section>

      <Section style={{ marginBottom: "20px" }}>
        <Text style={{ fontSize: "14px", color: COLORS.textDark, lineHeight: "1.6" }}>
          <strong>Qué puedes hacer:</strong>
        </Text>
        <ul style={{ margin: "10px 0", paddingLeft: "20px", fontSize: "14px", color: COLORS.textDark }}>
          <li style={{ marginBottom: "8px" }}>Explorar la ruta de aprendizaje</li>
          <li style={{ marginBottom: "8px" }}>Completar actividades y ganar monedas</li>
          <li style={{ marginBottom: "8px" }}>Jugar minijuegos educativos</li>
          <li>Acceder a la tienda virtual</li>
        </ul>
      </Section>

      <Section style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button
          href="https://monilab.com.mx"
          style={{
            background: `linear-gradient(135deg, ${COLORS.emerald} 0%, ${COLORS.cyan} 100%)`,
            color: COLORS.white,
            padding: "12px 30px",
            borderRadius: "8px",
            fontWeight: "bold",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Ir a Moni-Lab
        </Button>
      </Section>

      <Section
        style={{
          background: COLORS.lightGray,
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
          <strong>Consejo:</strong> Es más divertido aprender en compañía. Comparte tu experiencia con amigos y juntos dominen la educación financiera.
        </Text>
      </Section>
    </EmailLayout>
  );
} 