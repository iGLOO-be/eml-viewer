/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/Nbcgb6FCYTp
 */

import { ParsedMail } from "mailparser";
import prettyBytes from "pretty-bytes";

export function EmailViewer({ email }: { email: ParsedMail }) {
  return (
    <div className="flex flex-col min-h-0 overflow-hidden border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-start p-4 gap-4 border-b border-gray-200 dark:border-gray-800">
        <div className="grid gap-1 text-sm">
          <div className="font-semibold">{email.from?.text}</div>
          <div className="font-semibold">{email.subject}</div>
        </div>
        <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          {email.date?.toDateString()}
        </div>
      </div>
      <div className="flex items-start p-4 border-b border-gray-200 dark:border-gray-800">
        <ul className="grid gap-2">
          {email.attachments?.map((attachment, i) => (
            <li key={i} className="flex items-center gap-2">
              <div className="p-2 border border-gray-200 dark:border-gray-800 rounded-md dark:border-gray-800">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {attachment.filename} ({prettyBytes(attachment.size)})
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-4 text-sm prose prose-sm prose-p:leading-normal">
        <div
          dangerouslySetInnerHTML={{
            __html: email.textAsHtml || "",
          }}
        />
      </div>
    </div>
  );
}
