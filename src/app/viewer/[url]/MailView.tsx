import { ParsedMail } from "mailparser";

export function MailView({ email }: { email: ParsedMail }) {
  return (
    <>
      <h1>{email.subject}</h1>
      <div dangerouslySetInnerHTML={{ __html: email.textAsHtml || "" }} />
    </>
  );
}
