// BORRAR TODO ESTE ARCHIVO DESPUES DE PRUEBAS

import { render } from "@react-email/render";
import WelcomeEmail from "../../shared/mail/react/templates/WelcomeEmail";
import ConfirmRegistrationEmail from "../../shared/mail/react/templates/ConfirmRegistrationEmail";
import ResetPasswordEmail from "../../shared/mail/react/templates/ResetPasswordEmail";
import LowPerformanceEmail from "../../shared/mail/react/templates/LowPerformanceEmail";
import ConfirmChangeEmail from "../../shared/mail/react/templates/ConfirmChangeEmail";
import TutorReportEmail from "../../shared/mail/react/templates/TutorReportEmail";
import TutorBatchEmail from "../../shared/mail/react/templates/TutorBatchEmail";

export const emailPreviews = {
  welcome: async () =>
    (await render(
      WelcomeEmail({ nombre: "Luis Diego Méndez" })
    )) as unknown as string,

  confirmRegistration: async () =>
    (await render(
      ConfirmRegistrationEmail({
        nombre: "Luis Diego Méndez",
        confirmLink: "https://monilab.com.mx/auth/confirm-registration?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1aXMubWVuZGV6QGV4YW1wbGUuY29tIiwibm9tYnJlIjoiTFVJUyBESUVHTyIsInBhc3N3b3JkIjoiJDJiJDEwJFI4VHJ2UnRZSHFRWGZ0R3VxMGE4dU9FTlRkcFJ2UWNBYnp3UmcwSkRSdWlaMUlJcjA2QyIsInR5cGUiOiJSRUdJU1RSQVRSSU9OX0NPTkZJUk0iLCJpYXQiOjE3NzU4Njg2NTYsImV4cCI6MTc3NTg2OTU1Nn0.nCxEHExOzn6NosrHWEHCd0A6aIkHH0bqyk-1GJ2EJ18"
      })
    )) as unknown as string,

  resetPassword: async () =>
    (await render(
      ResetPasswordEmail({
        nombre: "Luis Diego Méndez",
        code: "482910"
      })
    )) as unknown as string,

  lowPerformance: async () =>
    (await render(
      LowPerformanceEmail({
        nombre: "Luis Diego Méndez",
        actividad: "Introducción a Presupuestos",
        intentos: 5
      })
    )) as unknown as string,

  confirmChange: async () =>
    (await render(
      ConfirmChangeEmail({
        nombreActual: "Luis Diego Méndez",
        nuevoNombre: "LMDVFINAL",
        link: "https://monilab.com.mx/auth/confirm-change?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        cambiaPass: true
      })
    )) as unknown as string,

  tutorReport: async () =>
    (await render(
      TutorReportEmail({
        nombre: "Luis Diego Méndez",
        progreso: 75,
        actividadesSemanales: [
          {
            nombre: "Ahorros Básicos",
            total_intentos: 2,
            mejor_puntaje: 85
          },
          {
            nombre: "Gastos Inteligentes",
            total_intentos: 4,
            mejor_puntaje: 55
          }
        ],
        unidadesCompletadas: [
          {
            titulo: "Unidad 1: Introducción a las Finanzas",
            metodo: "natural"
          }
        ]
      })
    )) as unknown as string,

  tutorBatch: async () =>
    (await render(
      TutorBatchEmail({
        nombreTutor: "Dr. Juan Pérez",
        cantidadEstudiantes: 3
      })
    )) as unknown as string
};

export type EmailPreviewType = keyof typeof emailPreviews;
