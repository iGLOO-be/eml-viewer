import { Suspense } from "react";
import { EmailParser } from "./EmailParser";
import { LoaderView } from "@/components/LoaderView";

export default async function ViewerPage(props: {
  searchParams: Promise<{ url?: string }>;
}) {
  const searchParams = await props.searchParams;
  const rawUrl = searchParams.url;

  if (!rawUrl) {
    return <div>No URL provided in query parameters</div>;
  }

  return (
    <Suspense fallback={<LoaderView />}>
      <EmailParser url={rawUrl} type="eml" />
    </Suspense>
  );
}

export let revalidate = 3600 * 24 * 7;
