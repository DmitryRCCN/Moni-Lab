import { Html, Body, Container, Text, Button, Section, Heading, Hr } from "@react-email/components";

interface ConfirmRegistrationEmailProps {
  nombre: string;
  confirmLink: string;
}

export default function ConfirmRegistrationEmail({ 
  nombre, 
  confirmLink 
}: ConfirmRegistrationEmailProps) {
  const nombrePrimero = nombre.split(' ')[0];

  return (
    <Html>
      <Body style={{ backgroundColor: "#020617", color: "#f8fafc", fontFamily: "sans-serif", padding: "20px" }}>
        <Container style={{ backgroundColor: "#0f172a", borderRadius: "12px", padding: "40px", border: "1px solid #1e293b", textAlign: "center" }}>
          <Heading style={{ color: "#fbbf24", fontSize: "28px", marginBottom: "10px" }}>
            🎓 ¡Bienvenido a Moni-Lab!
          </Heading>
          
          <Section>
            <Text style={{ fontSize: "16px", marginBottom: "5px" }}>
              Hola <strong>{nombrePrimero}</strong>,
            </Text>
            <Text style={{ fontSize: "14px", color: "#94a3b8", margin: "0" }}>
              Nos alegra mucho que te unas a nuestra comunidad de educación financiera.
            </Text>
          </Section>

          <Section style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", margin: "30px 0", textAlign: "left" }}>
            <Text style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
              Para completar tu registro, necesitamos que confirmes tu correo electrónico haciendo clic en el botón de abajo:
            </Text>
          </Section>

          <Button
            href={confirmLink}
            style={{
              backgroundColor: "#34d399",
              color: "#020617",
              padding: "14px 40px",
              borderRadius: "8px",
              fontWeight: "bold",
              textDecoration: "none",
              display: "inline-block",
              fontSize: "16px"
            }}
          >
            ✓ Confirmar mi Registro
          </Button>

          <Hr style={{ borderColor: "#334155", margin: "30px 0" }} />
          
          <Section style={{ backgroundColor: "#1a1f2e", padding: "15px", borderRadius: "6px", marginBottom: "20px" }}>
            <Text style={{ fontSize: "12px", color: "#94a3b8", margin: "0", lineHeight: "1.6" }}>
              <strong>⏱️ Este enlace expirará en 15 minutos.</strong>
              <br />
              Si no reconoces esta solicitud, puedes ignorar este correo de forma segura.
            </Text>
          </Section>

          <Text style={{ fontSize: "12px", color: "#64748b", margin: "20px 0 0 0" }}>
            En Moni-Lab aprendes finanzas de forma divertida a través de juegos y actividades interactivas.
            <br />
            <strong>¡Comienza tu viaje financiero hoy! 💰</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
