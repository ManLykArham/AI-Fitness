"use client";

import { useChat } from "ai/react";

function ChatBotPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <main className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-500 to-white">
      <div className="w-1/2 p-4 bg-gray-900 rounded-lg shadow-lg">
        <div className="flex flex-col h-[80vh] justify-between">
          <div className="overflow-y-auto p-4 space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2 rounded ${m.role === "user" ? "bg-gray-700 text-white" : "bg-gray-600 text-gray-300"}`}
              >
                <span className="font-bold">
                  {m.role === "user" ? "You: " : "AI: "}
                </span>
                {m.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    </main>
  );
}

export default ChatBotPage;
