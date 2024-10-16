import { Suspense } from "react";
import { EmailParser } from "../EmailParser";
import { LoaderView } from "@/components/LoaderView";

export default function ViewerPage({
  params: { url },
}: {
  params: { url: string };
}) {
  return (
    <Suspense fallback={<LoaderView />}>
      <EmailParser url={decodeURIComponent(url)} type="msg" />
    </Suspense>
  );
}

export const revalidate = 3600 * 24 * 7;
