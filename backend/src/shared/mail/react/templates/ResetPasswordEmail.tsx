import { Html, Body, Container, Text, Section, Heading } from "@react-email/components";

export default function ResetPasswordEmail({ nombre, code }: { nombre: string; code: string }) {
  return (
    <Html>
      <Body style={{ backgroundColor: "#020617", color: "#f8fafc", fontFamily: "sans-serif", padding: "20px" }}>
        <Container style={{ backgroundColor: "#0f172a", borderRadius: "12px", padding: "40px", border: "1px solid #1e293b", textAlign: "center" }}>
          <Heading style={{ color: "#fbbf24", fontSize: "24px" }}>🔑 Código de Seguridad</Heading>
          
          <Text style={{ fontSize: "16px" }}>Hola <strong>{nombre}</strong>,</Text>
          <Text style={{ fontSize: "14px", color: "#94a3b8" }}>
            Ingresa este código de 6 dígitos en la aplicación para restablecer tu contraseña.
          </Text>

          <Section style={{ backgroundColor: "#020617", padding: "20px", borderRadius: "8px", margin: "30px 0" }}>
            <Text style={{ margin: "0", fontSize: "36px", fontWeight: "bold", letterSpacing: "8px", color: "#34d399" }}>
              {code}
            </Text>
          </Section>

          <Text style={{ fontSize: "12px", color: "#64748b" }}>
            Este código expirará en 5 minutos.<br />
            Si no solicitaste esto, ignora este correo.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}