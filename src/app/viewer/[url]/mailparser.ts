import { ParsedMail, simpleParser } from "mailparser";
import { cache } from "react";

const tryFetch = async (url: string) => {
  try {
    const response = await fetch(url, {
      cache: "force-cache",
    });
    return {
      body: await response.text(),
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

export const parseEmail = cache(async (url: string) => {
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
    email: await parseEmailAndAttachments(body),
  };
});

const parseEmailAndAttachments = async (
  body: string | Buffer
): Promise<ParsedMail> => {
  const email = await simpleParser(body);
  return {
    ...email,
    attachments: (
      await Promise.all(
        email.attachments.map(async (attachment) => {
          if (attachment.contentType === "message/rfc822") {
            return [
              attachment,
              ...(await parseEmailAndAttachments(attachment.content))
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
