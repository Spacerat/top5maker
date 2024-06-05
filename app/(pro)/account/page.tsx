import AuthForm from "@/components/AuthForm";
import DialogButton from "@/components/DialogButton";
import { Card, Page } from "@/components/layout";
import { H1, H3 } from "@/components/text";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import React from "react";

export default async function Account() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Page slim>
      <H1>Your account</H1>
      <H3>Email: {user?.email}</H3>
      <div>
        <DialogButton
          button="Update password"
          variant="primary"
          contents={
            <Card>
              <AuthForm view="update_password" />
            </Card>
          }
        />
      </div>
    </Page>
  );
}
