"use server";

import { simpleParser } from "mailparser";

const tryFetch = async (url: string) => {
  try {
    const response = await fetch(url);
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

export const parseEmail = async (url: string) => {
  console.log(url);
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
};
