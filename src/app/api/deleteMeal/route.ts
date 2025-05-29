import { connectToDatabase } from "@/app/lib/dbConnection";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } // Parse the ID from the request body
  // Attempt to parse the request body and handle parsing errors
  let data;
  try {
    data = await request.json();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { id } = data;
  console.log("[id]: " + id);

  // Validate the presence and format of the ID
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing meal ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid meal ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("aifitnessdb");
    const collection = db.collection("meals");

    // Delete the exercise using the parsed ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return new Response(
        JSON.stringify({ message: "Meals deleted successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(JSON.stringify({ error: "Meals not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
