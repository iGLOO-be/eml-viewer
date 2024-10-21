import { Headers, ParsedMail, simpleParser } from "mailparser";
import { cache } from "react";
import MsgReader, { FieldsData } from "@kenjiuno/msgreader";
import escape from "lodash/escape";

export type MailTypes = "eml" | "msg";
export type SimplifiedParsedMail = {
  textAsHtml?: string;
  html?: string | boolean;
  headers: Headers;
  from?: ParsedMail["from"];
  to?: ParsedMail["to"];
  cc?: ParsedMail["cc"];
  bcc?: ParsedMail["bcc"];
  replyTo?: ParsedMail["replyTo"];
  subject?: string;
  date?: Date;
  attachments: ParsedMail["attachments"];
};

const nl2br = (str: string) => str.replace(/\n/g, "<br />");
const recipientToAddressObject = (
  recipient: Pick<FieldsData, "name" | "smtpAddress">
) => ({
  text: recipient.name || recipient.smtpAddress || "Unknown",
  html: `<a href="mailto:${escape(recipient.smtpAddress)}">${escape(
    recipient.name
      ? `${recipient.name} <${recipient.smtpAddress}>`
      : recipient.smtpAddress
  )}</a>`,
  value: [
    {
      address: recipient.smtpAddress,
      name: recipient.name || recipient.smtpAddress || "Unknown",
    },
  ],
});
const recipientsToAddressObject = (recipients: FieldsData[]) =>
  recipients?.map(recipientToAddressObject) || [];

const msgParser = async (msg: ArrayBuffer): Promise<SimplifiedParsedMail> => {
  const reader = new MsgReader(msg);
  const fileData = await reader.getFileData();
  return {
    html: fileData.html
      ? new TextDecoder().decode(fileData.html)
      : nl2br(fileData.body || ""),
    headers: new Map(), // fileData.headers,
    from: recipientToAddressObject({
      name: fileData.senderName,
      smtpAddress: fileData.senderSmtpAddress,
    }),
    to: recipientsToAddressObject(
      fileData.recipients?.filter((r) => r.recipType === "to") || []
    ),
    cc: recipientsToAddressObject(
      fileData.recipients?.filter((r) => r.recipType === "cc") || []
    ),
    bcc: recipientsToAddressObject(
      fileData.recipients?.filter((r) => r.recipType === "bcc") || []
    ),
    replyTo: undefined,
    subject: fileData.subject,
    date: new Date(
      fileData.clientSubmitTime || fileData.messageDeliveryTime || 0
    ),
    attachments: await Promise.all(
      fileData.attachments?.map(async (attachment) => ({
        filename: attachment.fileName,
        contentType: attachment.attachMimeTag || "application/octet-stream",
        size: attachment.contentLength || 0,
        content: Buffer.from(
          (
            await reader.getAttachment(attachment).content
          ).buffer
        ),
        related: false,
        type: "attachment",
        checksum: "", // TODO
        contentDisposition: "attachment",
        headers: new Map(), // TODO
        headerLines: [], // TODO
      })) || []
    ),
  };
};

const emlParser = async (eml: ArrayBuffer): Promise<SimplifiedParsedMail> => {
  const email = await simpleParser(Buffer.from(eml));
  return {
    ...email,
    attachments: (
      await Promise.all(
        email.attachments.map(async (attachment) => {
          if (attachment.contentType === "message/rfc822") {
            return [
              attachment,
              ...(await parseEmailAndAttachments(attachment.content, "eml"))
                .attachments,
            ];
          } else {
            return attachment;
          }
        })
      )
    ).flat(),
  };
};

const tryFetch = async (url: string) => {
  try {
    const response = await fetch(url, {
      cache: "force-cache",
    });
    return {
      body: await response.arrayBuffer(),
    };
  } catch (error: any) {
    console.error(error);
    return {
      error: {
        message: error.message,
      },
    };
  }
};

export const parseEmail = cache(async (url: string, type: MailTypes) => {
  const { body, error } = await tryFetch(url);
  if (error) {
    return { error };
  }
  if (!body) {
    return {
      error: {
        message: "No email body found",
      },
    };
  }
  return {
    email: await parseEmailAndAttachments(body, type),
  };
});

const parseEmailAndAttachments = async (
  body: ArrayBuffer,
  type: MailTypes
): Promise<SimplifiedParsedMail> => {
  const email: SimplifiedParsedMail =
    type === "eml" ? await emlParser(body) : await msgParser(body);
  return email;
};
