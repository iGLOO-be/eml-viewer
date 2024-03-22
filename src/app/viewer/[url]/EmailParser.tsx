import { EmailViewer } from "./EmailViewer";
import { ErrorView } from "./ErrorView";
import { parseEmail } from "./mailparser";

export async function EmailParser({ url }: { url: string }) {
  const { email, error } = await parseEmail(url);
  return (
    <>
      {error && <ErrorView error={error} />}
      {email && <EmailViewer email={email} />}
    </>
  );
}
