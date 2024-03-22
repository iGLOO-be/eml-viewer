import { EmailViewer } from "@/components/email-viewer";
import { parseEmail } from "./mailparser";
import { MailView } from "./MailView";

export async function Viewer({ url }: { url: string }) {
  const { email, error } = await parseEmail(url);
  return (
    <>
      {error && <div className="alert alert-danger">{error.message}</div>}
      {email && <EmailViewer email={email} />}
      <pre>{JSON.stringify({ email }, null, 2)}</pre>
    </>
  );
}
