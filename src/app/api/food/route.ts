// pages/api/exercise/route.ts

export async function POST(req: Request) {
  const { name } = await req.json();
  console.log(req.body);
  console.log("In the API init:" + name);

  // if (!activity || !duration) {
  //   res.status(400).json({ error: 'Missing required parameters: activity or duration' });
  //   return;
  // }
  if (!name) {
    return (
      new Response(),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const apiResponse = await fetch(
      `https://api.api-ninjas.com/v1/nutrition?query=` + name,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "uqvXuwvG+dMRJNNvCK/eDw==MSB3hIFeNEbBSWx3",
        },
      },
    );

    if (!apiResponse.ok) {
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    console.log(data);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
