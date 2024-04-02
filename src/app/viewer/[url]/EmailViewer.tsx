import type { ParsedMail } from "mailparser";
import prettyBytes from "pretty-bytes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const EmailViewer = ({ email }: { email: ParsedMail }) => (
  <div className="flex flex-col flex-1 p-2 h-full">
    <div className="flex items-start gap-4">
      <div className="grid gap-1 text-sm">
        <div className="font-semibold">{email.from?.text}</div>
        <RecipientList email={email} />
        <div className="font-semibold">{email.subject}</div>
      </div>
      <div className="ml-auto text-xs text-gray-500 dark:text-gray-200">
        {email.date?.toLocaleDateString()} {email.date?.toLocaleTimeString()}
      </div>
    </div>
    <Tabs className="flex flex-col flex-1 pt-2" defaultValue="text">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="text">Text</TabsTrigger>
        {email.html && <TabsTrigger value="html">HTML</TabsTrigger>}
        <TabsTrigger value="headers">Headers</TabsTrigger>
      </TabsList>
      <TabsContent className="flex-1" value="text">
        <AttachmentList attachments={email.attachments} />
        <div
          className="pt-2"
          dangerouslySetInnerHTML={{
            __html: email.textAsHtml || "",
          }}
        />
      </TabsContent>
      <TabsContent className="flex flex-col flex-1" value="html">
        <AttachmentList attachments={email.attachments} />
        <iframe className="flex flex-1 pt-2" srcDoc={email.html || ""} />
      </TabsContent>
      <TabsContent className="flex-1" value="headers">
        <HeaderList headers={email.headers} />
      </TabsContent>
    </Tabs>
  </div>
);

const RecipientList = ({ email }: { email: ParsedMail }) => {
  const addressToString = (address: ParsedMail["from"]) =>
    typeof address === "string" ? address : address?.text;
  const recipients = (
    [
      [email.to, "To: "],
      [email.cc, "Cc: "],
      [email.bcc, "Bcc: "],
      [email.replyTo, "Reply-To: "],
    ] as const
  )
    .map(([addresses, label]) => {
      return [
        Array.isArray(addresses)
          ? addresses.map(addressToString)
          : addresses
          ? [addressToString(addresses)]
          : [],
        label,
      ] as const;
    })
    .filter(([addresses]) => addresses.length > 0);
  return (
    <div className="grid gap-1">
      {recipients.map(([addresses, label]) =>
        addresses.length > 0 ? (
          <ul key={label} className="text-gray-500 dark:text-gray-200">
            {addresses.map((address, i) => (
              <li key={i}>
                <span className="font-semibold">{label}</span>
                {address}
              </li>
            ))}
          </ul>
        ) : null
      )}
    </div>
  );
};

const AttachmentList = ({
  attachments,
}: {
  attachments: ParsedMail["attachments"];
}) => (
  <ul className="flex gap-2">
    {attachments.map((attachment, i) => (
      <li key={i} className="flex items-center gap-2">
        <Badge className="hover:underline" variant="outline">
          <a
            href={`data:application/octet-stream;base64,${attachment.content.toString(
              "base64"
            )}`}
            download={attachment.filename}
          >
            {attachment.filename} ({prettyBytes(attachment.size)})
          </a>
        </Badge>
      </li>
    ))}
  </ul>
);

const HeaderList = ({ headers }: { headers: ParsedMail["headers"] }) => (
  <ul className="grid gap-2">
    {Array.from(headers, ([name, value]) => ({ name, value })).map(
      ({ name, value }, i) => (
        <li key={i} className="flex">
          <span className="font-semibold w-[20rem]">{name}</span>
          <pre className="flex-1">
            {typeof value === "string"
              ? value.toString()
              : JSON.stringify(value, null, 2)}
          </pre>
        </li>
      )
    )}
  </ul>
);
