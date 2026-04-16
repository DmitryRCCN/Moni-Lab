import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Img
} from "@react-email/components";
import React from "react";

type Props = {
  children: React.ReactNode;
  title?: string;
};

// Paleta de colores Moni-Lab
const COLORS = {
  darkForest: "#064e3b",
  darkGreen: "#0d7a66",
  emerald: "#10b981",
  cyan: "#06b6d4",
  amber: "#fbbf24",
  white: "#f8fafc",
  lightGray: "#f1f5f9",
  mediumGray: "#cbd5e1",
  darkGray: "#334155",
  textDark: "#1e293b",
};

export default function EmailLayout({ children, title }: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <Html lang="es">
      <Head>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
            }
          `}
        </style>
      </Head>
      <Body style={{ 
        backgroundColor: COLORS.lightGray, 
        padding: "20px",
        margin: 0
      }}>
        <Container
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "16px",
            border: `1px solid ${COLORS.mediumGray}`,
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)"
          }}
        >
          {/* HEADER CON GRADIENTE */}
          <Section
            style={{
              background: `linear-gradient(135deg, ${COLORS.darkGreen} 0%, ${COLORS.emerald} 100%)`,
              padding: "40px 30px",
              textAlign: "center"
            }}
          >
            <Heading
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: COLORS.white,
                margin: "0 0 10px 0",
                letterSpacing: "-0.5px"
              }}
            >
              Moni-Lab
            </Heading>
            <Text
              style={{
                fontSize: "14px",
                color: COLORS.white,
                opacity: 0.9,
                margin: 0,
                fontWeight: 300
              }}
            >
              Aprendiendo Jugando
            </Text>
          </Section>

          {/* CONTENIDO PRINCIPAL */}
          <Section style={{ padding: "40px 30px" }}>
            {title && (
              <Heading
                style={{
                  fontSize: "24px",
                  color: COLORS.darkGreen,
                  margin: "0 0 20px 0",
                  fontWeight: "bold"
                }}
              >
                {title}
              </Heading>
            )}
            {children}
          </Section>

          {/* FOOTER */}
          <Section
            style={{
              background: `linear-gradient(180deg, ${COLORS.lightGray} 0%, ${COLORS.white} 100%)`,
              padding: "30px",
              borderTop: `1px solid ${COLORS.mediumGray}`,
              textAlign: "center"
            }}
          >
            <Text
              role="separator"
              style={{
                height: "1px",
                background: COLORS.mediumGray,
                margin: "0 0 20px 0",
                border: "none"
              }}
            />
            <Text
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                margin: "0 0 5px 0",
                lineHeight: "1.5"
              }}
            >
              © {currentYear} Moni-Lab. Todos los derechos reservados.
            </Text>
            <Text
              style={{
                fontSize: "11px",
                color: COLORS.mediumGray,
                margin: "5px 0 0 0"
              }}
            >
              Educación Financiera para el Futuro
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export { COLORS };