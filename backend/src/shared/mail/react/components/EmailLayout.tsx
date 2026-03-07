import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text
} from "@react-email/components";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function EmailLayout({ children }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f4f4f4", fontFamily: "Arial" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "24px",
            borderRadius: "8px"
          }}
        >
          <Heading>Moni-Lab 🎓</Heading>

          {children}

          <Text style={{ fontSize: "12px", color: "#888" }}>
            © {new Date().getFullYear()} Moni-Lab
          </Text>
        </Container>
      </Body>
    </Html>
  );
}