//pseudocode

// get cookie
// check if cookie exists
// if yes then return 200 ok status
// if not then return 401 user not authenticated status

import { cookies } from "next/headers";

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const cookie = cookies().get("token");

    if (!cookie) {
      return new Response(
        JSON.stringify({ error: "Authentication Required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "User authentication successful" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Failed to retrieve exercises", error);
    return new Response(
      JSON.stringify({ error: "Failed to check is user is authenticated" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
