import AuthForm from "@/components/AuthForm";
import { Footer, ProBrand } from "@/components/Brand";
import { Button } from "@/components/Button";
import Dialog from "@/components/Dialog";
import DialogButton from "@/components/DialogButton";
import { SideBySideButtons } from "@/components/SideBySideButtons";
import { Header, Main, Page } from "@/components/layout";
import { Text, H2 } from "@/components/text";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user) {
    redirect("/account");
  }

  return (
    <Main>
      <Header>
        <ProBrand />
        <DialogButton
          kind="secondary"
          button="Get Started"
          contents={<AuthForm view="sign_up" />}
        />
      </Header>
      <Page>
        <Dialog>
          <AuthForm view="magic_link" />
        </Dialog>
        <H2>
          Align on priority and sort great ideas{" "}
          <Text color="primary1">like a star</Text>
        </H2>
        <SideBySideButtons>
          <DialogButton
            button={<H2>Get Started</H2>}
            contents={<AuthForm view="sign_up" />}
          />
          <Link href="/">
            <Button>
              <H2>Try the demo</H2>
            </Button>
          </Link>
        </SideBySideButtons>
      </Page>
      <Footer />
    </Main>
  );
}
