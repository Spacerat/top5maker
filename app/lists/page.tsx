import { Brand } from "@/components/Brand";
import { Card, CardGrid, Header, Main, Page } from "@/components/layout";
import { H1, NavLink } from "@/components/text";
import { serverClient } from "@/utils/client";
import { NewListButton } from "./NewListButton";
import Link from "next/link";
import { encodeId } from "@/utils/ids";

async function getLists() {
  return await serverClient().from("List").select("*").limit(10);
}

export default async function Lists() {
  const lists = await getLists();

  return (
    <Main>
      <Header>
        <div className="flex flex-row items-baseline gap-12">
          <Brand />
          <div className="flex flex-row items-baseline gap-8">
            <NavLink href={"/lists"}>Your Lists</NavLink>
          </div>
        </div>
        <NavLink href={"/account"}>Account</NavLink>
      </Header>
      <Page kind="darker">
        <div className="flex flex-row gap-8">
          <H1>Your Lists</H1>
          <NewListButton />
        </div>
        <CardGrid>
          {lists?.data?.map((list) => (
            <Card key={list.list_id}>
              <Link href={`/lists/${encodeId(list.list_id)}`}>{list.name}</Link>
            </Card>
          ))}
        </CardGrid>
      </Page>
    </Main>
  );
}
