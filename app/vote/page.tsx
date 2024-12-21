import { Vote } from "./vote";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  return <Vote initialParams={searchParams} />;
}
