import AuthForm from "@/components/AuthForm";
import { Brand } from "@/components/Brand";
import { Header, Page } from "@/components/layout";
import React from "react";

export default function Login() {
  return (
    <>
      <Header>
        <Brand />
      </Header>
      <Page slim>
        <AuthForm view="magic_link" />
      </Page>
    </>
  );
}
