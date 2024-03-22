import { Viewer } from "./Viewer";

export default function ViewerPage({
  params: { url },
}: {
  params: { url: string };
}) {
  return <Viewer url={decodeURIComponent(url)} />;
}
