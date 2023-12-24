import { Brand } from "@/components/Brand";
import { Header, Main } from "@/components/layout";
import { NavLink } from "@/components/text";

export default function Layout({ children }: { children: React.ReactNode }) {
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
      {children}
    </Main>
  );
}
