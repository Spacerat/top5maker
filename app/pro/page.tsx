import AuthForm from "@/components/AuthForm";
import { Footer, ProBrand } from "@/components/Brand";
import { LinkButton } from "@/components/Button";
import DialogButton from "@/components/DialogButton";
import { SideBySideButtons } from "@/components/SideBySideButtons";
import { Card, Header, Main, Page } from "@/components/layout";
import { Text, H2 } from "@/components/text";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/lists");
  }

  const dialog = (
    <Card>
      <AuthForm view="magic_link" />
    </Card>
  );

  return (
    <Main>
      <Header>
        <ProBrand />
        <DialogButton
          variant="secondary"
          button="Get Started"
          contents={dialog}
        />
      </Header>
      <Page>
        <H2>
          Align on priority and sort great ideas{" "}
          <Text color="primary1">like a star</Text>
        </H2>
        <SideBySideButtons>
          <DialogButton button={<H2>Get Started</H2>} contents={dialog} />
          <LinkButton href="/">
            <H2>Try the demo</H2>
          </LinkButton>
        </SideBySideButtons>
      </Page>
      <Footer />
    </Main>
  );
}
