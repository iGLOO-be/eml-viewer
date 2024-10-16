import { EmailViewer } from "./EmailViewer";
import { ErrorView } from "./ErrorView";
import { MailTypes, parseEmail } from "./mailparser";

export async function EmailParser({
  url,
  type,
}: {
  url: string;
  type: MailTypes;
}) {
  const { error, email } = await parseEmail(url, type);
  return (
    <>
      {error && <ErrorView error={error} />}
      {email && <EmailViewer email={email} />}
    </>
  );
}
