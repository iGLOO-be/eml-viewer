import { EmailParser } from "./EmailParser";

export default function ViewerPage({
  params: { url },
}: {
  params: { url: string };
}) {
  return <EmailParser url={decodeURIComponent(url)} />;
}
