import { NavLinks } from "@/components/layout";
import { NavLink } from "@/components/text";

export function TopNav({ active }: { active: "sort" | "vote" }) {
  return (
    <NavLinks>
      <NavLink href="/" active={active === "sort"}>
        Sort Star
      </NavLink>
      <NavLink href="/vote" active={active === "vote"}>
        Vote Star
      </NavLink>
    </NavLinks>
  );
}
