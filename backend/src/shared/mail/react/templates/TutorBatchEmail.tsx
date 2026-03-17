import { Text, Heading } from "@react-email/components";
import EmailLayout from "../components/EmailLayout";

type Props = {
  nombreTutor: string;
  cantidadEstudiantes: number;
};

export default function TutorBatchEmail({ nombreTutor, cantidadEstudiantes }: Props) {
  return (
    <EmailLayout>
      <Heading style={{ color: '#10b981', fontSize: '24px' }}>
        ¡Hola, {nombreTutor}! 📊
      </Heading>
      <Text>
        Aquí tienes el resumen semanal de tus estudiantes en <b>Moni-Lab</b>.
      </Text>
      <Text>
        Adjunto a este correo encontrarás <b>{cantidadEstudiantes} reporte(s) en PDF</b> con el detalle del progreso, los intentos y las áreas de oportunidad de cada uno de tus alumnos.
      </Text>
      <Text style={{ fontSize: '12px', color: '#6b7280', marginTop: '30px' }}>
        Este es un correo automático generado por el sistema de Moni-Lab.
      </Text>
    </EmailLayout>
  );
}