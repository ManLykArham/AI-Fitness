import { connectToDatabase } from "./dbConnection";
import { ObjectId } from "mongodb";

interface IMessage {
  id: string;
  role: "user" | "ai" | "system";
  content: string;
  isInitial?: boolean;
  timestamp?: string;
}

interface ISession {
  createdAt: Date;
  messages: IMessage[];
  threadID?: string;
}

export async function saveChatMessages(
  UserID: string,
  messages: IMessage[],
  threadID: string
) {
  const client = await connectToDatabase();
  const db = client.db("aifitnessdb");

  const today = new Date().toISOString().split("T")[0]; // e.g. "2025-05-29"

  const userRecord = await db.collection("chatHistories").findOne({ UserID });

  if (!userRecord) {
    // Create new user document with first session
    const newSession: ISession = {
      createdAt: new Date(),
      messages,
      threadID,
    };

    await db.collection("chatHistories").insertOne({
      UserID,
      sessions: [newSession],
    });
    return;
  }

  const lastSession = userRecord.sessions[userRecord.sessions.length - 1];
  const lastSessionDate = new Date(lastSession.createdAt)
    .toISOString()
    .split("T")[0];

  if (today !== lastSessionDate) {
    // New day → push new session
    const newSession: ISession = {
      createdAt: new Date(),
      messages,
      threadID,
    };

    await db
      .collection("chatHistories")
      .updateOne({ UserID }, { $push: { sessions: newSession } });
  } else {
    // Same day → update existing session
    await db.collection("chatHistories").updateOne(
      { UserID, "sessions.createdAt": lastSession.createdAt },
      {
        $set: {
          "sessions.$.messages": messages,
          "sessions.$.threadID": threadID,
        },
      }
    );
  }
}

export async function getChatHistory(UserID: string) {
  const client = await connectToDatabase();
  const db = client.db("aifitnessdb");

  const userRecord = await db.collection("chatHistories").findOne({ UserID });

  if (!userRecord || !userRecord.sessions || userRecord.sessions.length === 0) {
    return null;
  }

  const latestSession = userRecord.sessions[userRecord.sessions.length - 1];

  return {
    threadID: latestSession.threadID || "",
    messages: latestSession.messages || [],
    createdAt: latestSession.createdAt?.toISOString() || null,
  };
}

export async function clearTodayChatSession(userID: string) {
  const client = await connectToDatabase();
  const db = client.db("aifitnessdb");

  const result = await db
    .collection("chatHistories")
    .deleteOne({ UserID: userID });

  return result.deletedCount > 0;
}
