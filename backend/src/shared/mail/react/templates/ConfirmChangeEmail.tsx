import { Text, Button, Section, Heading } from "@react-email/components";
import EmailLayout, { COLORS } from "../components/EmailLayout";

interface ConfirmProps {
  nombreActual: string;
  nuevoNombre: string;
  link: string;
  cambiaPass: boolean;
}

export default function ConfirmChangeEmail({ nombreActual, nuevoNombre, link, cambiaPass }: ConfirmProps) {
  const nombrePrimero = nombreActual.split(' ')[0];

  return (
    <EmailLayout title="Confirmación Necesaria">
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

      <Section style={{ marginBottom: "20px" }}>
        <Text
          style={{
            fontSize: "15px",
            color: COLORS.textDark,
            margin: "0 0 20px 0",
            lineHeight: "1.6"
          }}
        >
          Hemos recibido una solicitud para actualizar los datos de tu cuenta en Moni-Lab. Revisa los cambios que se aplicarán:
        </Text>
      </Section>

      <Section
        style={{
          background: `linear-gradient(135deg, ${COLORS.emerald}15 0%, ${COLORS.cyan}15 100%)`,
          border: `1px solid ${COLORS.mediumGray}`,
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "25px"
        }}
      >
        {cambiaPass ? (
          <>
            <Text style={{ fontSize: "14px", color: COLORS.textDark, margin: "0 0 10px 0", fontWeight: "bold" }}>
              Cambios solicitados:
            </Text>
            <Text style={{ fontSize: "13px", color: COLORS.textDark, margin: "5px 0" }}>
              Nuevo Usuario: <strong>{nuevoNombre}</strong>
            </Text>
            <Text style={{ fontSize: "13px", color: COLORS.textDark, margin: "5px 0" }}>
              Contraseña: Se modificará
            </Text>
          </>
        ) : (
          <>
            <Text style={{ fontSize: "14px", color: COLORS.textDark, margin: "0 0 10px 0", fontWeight: "bold" }}>
              Nuevo Usuario:
            </Text>
            <Text style={{ fontSize: "13px", color: COLORS.textDark, margin: "5px 0" }}>
              <strong>{nuevoNombre}</strong>
            </Text>
          </>
        )}
      </Section>

      <Section
        style={{
          background: `linear-gradient(135deg, ${COLORS.amber}20 0%, ${COLORS.emerald}20 100%)`,
          border: `2px solid ${COLORS.emerald}`,
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "25px",
          textAlign: "center"
        }}
      >
        <Button
          href={link}
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
          Confirmar Cambios
        </Button>
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
          <strong>Importante:</strong> Este enlace expirará en 15 minutos. Si no solicitaste esta actualización, ignora este correo. Los cambios no se aplicarán sin tu confirmación.
        </Text>
      </Section>

      <Section style={{ marginBottom: "0" }}>
        <Text
          style={{
            fontSize: "13px",
            color: COLORS.textDark,
            margin: "0",
            lineHeight: "1.5"
          }}
        >
          Tu seguridad es prioritaria. Si tienes dudas, no confirmes y contacta con nuestro equipo.
        </Text>
      </Section>
    </EmailLayout>
  );
}
