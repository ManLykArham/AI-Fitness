import { MongoClient, Db, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URI!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 8000,
  socketTimeoutMS: 9000,
});

// Track the database connection status
const connection = {
  isConnected: false,
  db: null as Db | null,
};

export async function connectToDatabase(): Promise<MongoClient> {
  if (connection.isConnected && connection.db) {
    console.log("Already connected to MongoDB.");
    return client;
  }

  if (!process.env.DATABASE_URI) {
    throw new Error("DATABASE_URI must be specified in environment variables.");
  }

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    connection.db = client.db("aifitnessdb");
    console.log("...");
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connected.");
    connection.isConnected = true;
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }

  return client;
}
