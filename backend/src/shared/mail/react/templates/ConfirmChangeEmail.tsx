// backend/src/shared/mail/react/templates/ConfirmChangeEmail.tsx
import { Html, Body, Container, Text, Button, Section, Heading, Hr } from "@react-email/components";

interface ConfirmProps {
  nombreActual: string;
  nuevoNombre: string;
  link: string;
  cambiaPass: boolean;
}

export default function ConfirmChangeEmail({ nombreActual, nuevoNombre, link, cambiaPass }: ConfirmProps) {
  return (
    <Html>
      <Body style={{ backgroundColor: "#020617", color: "#f8fafc", fontFamily: "sans-serif", padding: "20px" }}>
        <Container style={{ backgroundColor: "#0f172a", borderRadius: "12px", padding: "40px", border: "1px solid #1e293b", textAlign: "center" }}>
          <Heading style={{ color: "#fbbf24", fontSize: "24px", marginBottom: "20px" }}>🛡️ Verificación de Seguridad</Heading>
          
          <Section>
            <Text style={{ fontSize: "16px" }}>Hola <strong>{nombreActual}</strong>,</Text>
            <Text style={{ fontSize: "14px", color: "#94a3b8" }}>
              Hemos recibido una solicitud para actualizar tus datos en Moni-Lab:
            </Text>
          </Section>

          <Section style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", margin: "20px 0", textAlign: "left" }}>
            <Text style={{ margin: "5px 0", fontSize: "14px" }}>
              ✨ <strong>Nuevo Nombre:</strong> {nuevoNombre}
            </Text>
            {cambiaPass && (
              <Text style={{ margin: "5px 0", fontSize: "14px" }}>
                🔑 <strong>Seguridad:</strong> Se ha solicitado un cambio de contraseña.
              </Text>
            )}
          </Section>

          <Text style={{ fontSize: "14px", marginBottom: "25px" }}>
            Para aplicar estos cambios, por favor haz clic en el siguiente botón:
          </Text>

          <Button
            href={link}
            style={{
              backgroundColor: "#fbbf24",
              color: "#020617",
              padding: "12px 30px",
              borderRadius: "6px",
              fontWeight: "bold",
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            Confirmar Actualización
          </Button>

          <Hr style={{ borderColor: "#334155", margin: "30px 0" }} />
          
          <Text style={{ fontSize: "12px", color: "#64748b" }}>
            Si no reconoces esta actividad, ignora este correo. Los cambios no se aplicarán a menos que confirmes.
            <br />Este enlace expirará en 15 minutos.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}