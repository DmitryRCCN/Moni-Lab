import { Html, Body, Container, Text, Button, Section, Heading } from "@react-email/components";

interface ConfirmRegistrationEmailProps {
  nombre: string;
  confirmLink: string;
}

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

export default function ConfirmRegistrationEmail({ 
  nombre, 
  confirmLink 
}: ConfirmRegistrationEmailProps) {
  const nombrePrimero = nombre.split(' ')[0];

  return (
    <Html lang="es">
      <Body style={{ 
        backgroundColor: COLORS.lightGray,
        padding: "20px",
        margin: 0,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
      }}>
        <Container style={{
          backgroundColor: COLORS.white,
          borderRadius: "16px",
          border: `1px solid ${COLORS.mediumGray}`,
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)"
        }}>
          {/* HEADER */}
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

          {/* CONTENIDO */}
          <Section style={{ padding: "40px 30px" }}>
            <Heading
              style={{
                fontSize: "24px",
                color: COLORS.darkGreen,
                margin: "0 0 15px 0",
                fontWeight: "bold"
              }}
            >
              Confirma tu Registro
            </Heading>

            <Text
              style={{
                fontSize: "16px",
                color: COLORS.textDark,
                margin: "0 0 20px 0",
                lineHeight: "1.6"
              }}
            >
              Hola <strong>{nombrePrimero}</strong>,
            </Text>

            <Text
              style={{
                fontSize: "15px",
                color: COLORS.textDark,
                margin: "0 0 20px 0",
                lineHeight: "1.6"
              }}
            >
              Para completar tu registro y comenzar tu viaje de educación financiera con Moni-Lab, necesitamos que confirmes tu correo electrónico.
            </Text>

            <Section
              style={{
                background: `linear-gradient(135deg, ${COLORS.amber}15 0%, ${COLORS.emerald}15 100%)`,
                border: `2px solid ${COLORS.emerald}`,
                borderRadius: "12px",
                padding: "25px",
                marginBottom: "25px",
                textAlign: "center"
              }}
            >
              <Button
                href={confirmLink}
                style={{
                  background: `linear-gradient(135deg, ${COLORS.emerald} 0%, ${COLORS.cyan} 100%)`,
                  color: COLORS.white,
                  padding: "14px 40px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textDecoration: "none",
                  display: "inline-block",
                  fontSize: "16px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Confirmar Registro
              </Button>
            </Section>

            <Text
              style={{
                fontSize: "14px",
                color: COLORS.textDark,
                margin: "0 0 15px 0",
                lineHeight: "1.5"
              }}
            >
              O copia este enlace en tu navegador:
            </Text>

            <Section
              style={{
                background: COLORS.lightGray,
                borderRadius: "6px",
                padding: "12px",
                marginBottom: "20px",
                wordBreak: "break-all"
              }}
            >
              <Text
                style={{
                  fontSize: "12px",
                  color: COLORS.darkGray,
                  margin: 0,
                  fontFamily: "monospace"
                }}
              >
                {confirmLink.substring(0, 100)}...
              </Text>
            </Section>

            <Section
              style={{
                background: `${COLORS.amber}15`,
                borderLeft: `4px solid ${COLORS.amber}`,
                borderRadius: "6px",
                padding: "15px",
                marginBottom: "20px"
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
                <strong>Nota importante:</strong> Este enlace expirará en 15 minutos. Si no reconoces esta solicitud, puedes ignorar este correo de forma segura.
              </Text>
            </Section>

            <Text
              style={{
                fontSize: "13px",
                color: COLORS.textDark,
                margin: "20px 0 0 0",
                lineHeight: "1.5"
              }}
            >
              Una vez confirmes tu correo, podrás acceder a:
            </Text>
            <ul style={{ margin: "10px 0", paddingLeft: "20px", fontSize: "13px", color: COLORS.textDark }}>
              <li style={{ marginBottom: "6px" }}>Lecciones interactivas sobre finanzas</li>
              <li style={{ marginBottom: "6px" }}>Minijuegos educativos</li>
              <li>Seguimiento de tu progreso</li>
            </ul>
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
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                margin: "0",
                lineHeight: "1.5"
              }}
            >
              © {new Date().getFullYear()} Moni-Lab. Todos los derechos reservados.
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