import React from "react";
import { Text, Heading, Section } from "@react-email/components";
import EmailLayout from "../components/EmailLayout";

type Props = {
  nombre: string;
  progreso: number;
  actividadesCompletadas: number;
  actividadesTotales: number;
};

export default function TutorReportEmail({
  nombre,
  progreso,
  actividadesCompletadas,
  actividadesTotales
}: Props) {
  return (
    <EmailLayout>
      <Heading>Reporte de progreso del estudiante 📊</Heading>

      <Text>
        El estudiante <b>{nombre}</b> tiene actualmente el siguiente progreso
        en la plataforma Moni-Lab:
      </Text>

      <Section>
        <Text>
          📈 Progreso total: <b>{progreso}%</b>
        </Text>

        <Text>
          ✅ Actividades completadas: <b>{actividadesCompletadas}</b>
        </Text>

        <Text>
          📚 Actividades totales: <b>{actividadesTotales}</b>
        </Text>
      </Section>

      <Text>
        Este reporte puede ayudarte a identificar el avance del estudiante y
        detectar posibles áreas donde necesite apoyo adicional.
      </Text>

      <Text>
        — Sistema de análisis educativo de Moni-Lab
      </Text>
    </EmailLayout>
  );
}