import { Text, Heading, Section, Html, Body, Container } from "@react-email/components";
import EmailLayout, { COLORS } from "../components/EmailLayout";

type Props = {
  nombre: string;
  code: string;
};

export default function ResetPasswordEmail({ nombre, code }: Props) {
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
              Recuperar Contraseña
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
              Código de Seguridad
            </Heading>

            <Text
              style={{
                fontSize: "16px",
                color: COLORS.textDark,
                margin: "0 0 25px 0",
                lineHeight: "1.6"
              }}
            >
              Hola <strong>{nombrePrimero}</strong>,
            </Text>

            <Text
              style={{
                fontSize: "15px",
                color: COLORS.textDark,
                margin: "0 0 25px 0",
                lineHeight: "1.6"
              }}
            >
              Hemos recibido una solicitud para restablecer tu contraseña. Ingresa este código en la aplicación para continuar:
            </Text>

            <Section
              style={{
                background: `linear-gradient(135deg, ${COLORS.amber}20 0%, ${COLORS.emerald}20 100%)`,
                border: `3px solid ${COLORS.emerald}`,
                borderRadius: "12px",
                padding: "30px",
                marginBottom: "25px",
                textAlign: "center"
              }}
            >
              <Text
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: COLORS.darkGreen,
                  margin: "0",
                  letterSpacing: "8px",
                  fontFamily: "monospace"
                }}
              >
                {code}
              </Text>
            </Section>

            <Section
              style={{
                background: `linear-gradient(180deg, ${COLORS.cyan}10 0%, ${COLORS.emerald}10 100%)`,
                border: `1px solid ${COLORS.mediumGray}`,
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px"
              }}
            >
              <Text
                style={{
                  fontSize: "13px",
                  color: COLORS.textDark,
                  margin: 0,
                  lineHeight: "1.5"
              }}
              >
                <strong>Validez del código:</strong> Este código expirará en 5 minutos. Cópialo y úsalo rápidamente.
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
                <strong>Seguridad:</strong> Si no solicitaste este cambio, ignora este correo. Tu cuenta seguirá protegida.
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
              Pasos a seguir:
            </Text>
            <ol style={{ margin: "10px 0", paddingLeft: "20px", fontSize: "13px", color: COLORS.textDark }}>
              <li style={{ marginBottom: "6px" }}>Copia el código anterior</li>
              <li style={{ marginBottom: "6px" }}>Ve a la aplicación Moni-Lab</li>
              <li>Pega el código en el campo indicado</li>
            </ol>
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