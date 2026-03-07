import React from "react";
import { Text, Heading } from "@react-email/components";
import EmailLayout from "../components/EmailLayout";

type Props = {
  nombre: string;
  actividad: string;
  intentos: number;
};

export default function LowPerformanceEmail({
  nombre,
  actividad,
  intentos
}: Props) {
  return (
    <EmailLayout>
      <Heading>Te recomendamos reforzar este tema ⚠️</Heading>

      <Text>Hola {nombre},</Text>

      <Text>
        Detectamos que la actividad <b>{actividad}</b> ha requerido varios
        intentos para completarse.
      </Text>

      <Text>
        Número de intentos registrados: <b>{intentos}</b>
      </Text>

      <Text>
        Te recomendamos repasar el nodo correspondiente antes de continuar con
        las siguientes actividades.
      </Text>

      <Text>
        Recuerda que aprender toma práctica. ¡Tú puedes lograrlo! 🚀
      </Text>
    </EmailLayout>
  );
}