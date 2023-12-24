import AuthForm from "@/components/AuthForm";
import { Brand } from "@/components/Brand";
import { Header, Main, Page } from "@/components/layout";
import { H1, H3 } from "@/components/text";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import React from "react";

export default async function Account() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  return (
    <Page slim>
      <H1>Your account</H1>
      <H3>Email</H3>
      <span>{user?.email}</span>
      <H3>Update Password</H3>
      <AuthForm view="update_password" />
      <H3>Forgotten Password</H3>
      <AuthForm view="forgotten_password" />
    </Page>
  );
}
