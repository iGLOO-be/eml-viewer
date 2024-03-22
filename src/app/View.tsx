"use server";

import { parseEmail } from "./viewer/[url]/mailparser";

export const View: React.FC<{ url: string }> = async (props) => {
  console.log(props)
  // const parsedEmail = await parseEmail(props.url);

  return <pre>{JSON.stringify(props, null, 2)}</pre>;
};
