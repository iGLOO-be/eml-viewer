import { Suspense } from "react";
import { EmailParser } from "../EmailParser";
import { LoaderView } from "@/components/LoaderView";

export default async function ViewerPage(props: {
  params: Promise<{ url: string }>;
}) {
  const params = await props.params;
  const { url } = params;
  let rawUrl = params.url;
  // Because Vercel decode qs
  const decodedUrl = decodeURIComponent(decodeURIComponent(rawUrl));
  const qs = new URLSearchParams(decodedUrl.split("?")[1]);
  const finalUrl = `${decodedUrl.split("?")[0]}?${qs
    .toString()
    .replaceAll("+", "%2B")
    .replaceAll(" ", "%20")}`;

  return (
    <Suspense fallback={<LoaderView />}>
      <EmailParser url={finalUrl} type="eml" />
    </Suspense>
  );
}

export let revalidate = 3600 * 24 * 7;
