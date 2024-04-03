import type { ParsedMail } from "mailparser";
import prettyBytes from "pretty-bytes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const EmailViewer = ({ email }: { email: ParsedMail }) => (
  <div className="flex flex-col flex-1 h-full">
    <Header email={email} />
    <Tabs className="flex flex-col flex-1" defaultValue="text">
      <TabsList className="w-full justify-start">
        {email.textAsHtml && <TabsTrigger value="text">Text</TabsTrigger>}
        {email.html && <TabsTrigger value="html">HTML</TabsTrigger>}
        <TabsTrigger value="headers">Headers</TabsTrigger>
      </TabsList>
      <TabsContent className="flex-1" value="text">
        <AttachmentList attachments={email.attachments} />
        <div
          dangerouslySetInnerHTML={{
            __html: email.textAsHtml || "",
          }}
        />
      </TabsContent>
      <TabsContent className="flex flex-col flex-1" value="html">
        <AttachmentList attachments={email.attachments} />
        <iframe
          className="flex flex-1 dark:bg-gray-300"
          srcDoc={email.html || ""}
        />
      </TabsContent>
      <TabsContent className="flex-1" value="headers">
        <HeaderList headers={email.headers} />
      </TabsContent>
    </Tabs>
  </div>
);

const Header = ({ email }: { email: ParsedMail }) => (
  <div className="flex items-start gap-4 pb-2">
    <div className="grid gap-1 text-sm">
      {email.from?.html && (
        <div
          className="font-semibold"
          dangerouslySetInnerHTML={{
            __html: email.from.html,
          }}
        />
      )}
      <RecipientList email={email} />
      <div className="font-semibold">{email.subject}</div>
    </div>
    <div className="ml-auto text-xs text-gray-500 dark:text-gray-200">
      {email.date?.toLocaleString()}
    </div>
  </div>
);

const RecipientList = ({ email }: { email: ParsedMail }) => {
  const addressToString = (address: ParsedMail["from"]) => address?.html;
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
        (Array.isArray(addresses)
          ? addresses.map(addressToString)
          : addresses
          ? [addressToString(addresses)]
          : []
        ).filter((address) => address !== undefined) as string[],
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
                <span
                  dangerouslySetInnerHTML={{
                    __html: address,
                  }}
                />
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
  <ul className="pb-2">
    {attachments.map((attachment, i) => (
      <li key={i} className="pr-2 inline-block truncate">
        <Badge className="hover:underline" variant="outline">
          <a
            href={`data:application/octet-stream;base64,${attachment.content.toString(
              "base64"
            )}`}
            download={attachment.filename}
          >
            {attachment.filename || "No filename"} (
            {prettyBytes(attachment.size)})
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
