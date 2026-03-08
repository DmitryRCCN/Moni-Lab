import React from "react";
import { Text, Heading } from "@react-email/components";
import EmailLayout from "../components/EmailLayout";

type Props = {
  nombre: string;
};

export default function WelcomeEmail({ nombre }: Props) {
  return (
    <EmailLayout>
      <Heading>Bienvenido {nombre} 👋</Heading>

      <Text>
        Gracias por registrarte en <b>Moni-Lab</b>.
      </Text>

      <Text>
        Ahora puedes comenzar a aprender con nuestras lecciones interactivas.
      </Text>

      <Text>
        🚀 ¡Mucho éxito!
      </Text>
    </EmailLayout>
  );
} 