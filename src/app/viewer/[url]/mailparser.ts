import { simpleParser } from "mailparser";
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
  // await new Promise((resolve) => setTimeout(resolve, 1000));
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
  const email = await simpleParser(body);
  return { email };
});
