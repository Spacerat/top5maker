import { ProBrand } from "@/components/Brand";
import { Header, NavLinks } from "@/components/layout";
import { NavLink } from "@/components/text";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header>
        <div className="flex flex-row items-baseline gap-12">
          <ProBrand />
          <NavLinks>
            <NavLink href={"/lists"}>Your Lists</NavLink>
          </NavLinks>
        </div>
        <NavLink href={"/account"}>Account</NavLink>
      </Header>
      {children}
    </>
  );
}
