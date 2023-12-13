"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa, ViewType } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { getAbsoluteUrl } from "@/utils/absoluteUrl";

export default function AuthForm({ view }: { view: ViewType }) {
  const supabase = createClientComponentClient<Database>();

  const origin = getAbsoluteUrl();

  return (
    <Auth
      supabaseClient={supabase}
      view={view}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: "var(--primary1)",
              brandAccent: "var(--primary2)",
              messageBackground: "var(--primary4plusplus)",
              messageBorder: "var(--primary3)",
              messageText: "var(--primary2)",
            },
          },
        },
      }}
      theme="light"
      showLinks={false}
      providers={[]}
      redirectTo={`${origin}/auth/callback`}
    />
  );
}
