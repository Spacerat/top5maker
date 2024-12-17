import { NavLinks } from "@/components/layout";
import { NavLink } from "@/components/text";

export function TopNav({
  active,
  className,
}: {
  active: "sort" | "vote";
  className?: string;
}) {
  return (
    <NavLinks className={className}>
      <NavLink href="/" active={active === "sort"}>
        Sort Star
      </NavLink>
      <NavLink href="/vote" active={active === "vote"}>
        Vote Star
      </NavLink>
    </NavLinks>
  );
}
