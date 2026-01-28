import { Suspense } from "react";
import { EmailParser } from "../../EmailParser";
import { LoaderView } from "@/components/LoaderView";

export default async function ViewerPage(
  props: {
    params: Promise<{ url: string }>;
  }
) {
  const params = await props.params;

  const {
    url
  } = params;

  return (
    <Suspense fallback={<LoaderView />}>
      <EmailParser url={decodeURIComponent(url)} type="msg" />
    </Suspense>
  );
}

export let revalidate = 3600 * 24 * 7;
