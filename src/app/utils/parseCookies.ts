import { NextApiRequest } from "next";

export function parseCookies(req: Request) {
  const cookie = req.headers.cookie;
  if (!cookie) return {}; // Return an empty object if there are no cookies

  return cookie
    .split(";")
    .map((v: string) => v.split("="))
    .reduce((acc: { [key: string]: string }, v: string[]) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}
