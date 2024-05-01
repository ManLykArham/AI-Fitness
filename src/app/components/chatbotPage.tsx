import React, { useState, FormEvent, ChangeEvent } from 'react';

// Define interfaces for types
interface IMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

interface IChatHook {
  messages: IMessage[];
  input: string;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (userInput: string, chatbotResponse: string) => void;
}

// Define the custom hook
function useChat(): IChatHook {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  const handleSubmit = (userInput: string, chatbotResponse: string): void => {
    setMessages(prevMessages => [
      ...prevMessages,
      { id: `msg_${prevMessages.length}`, role: 'user', content: userInput }
    ]);
    // Example response handling
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: `msg_${prevMessages.length}`, role: 'ai', content: chatbotResponse || "Response from AI" }
      ]);
      setInput("");
    }, 500);
  };

  return { messages, input, handleInputChange, handleSubmit };
}

// Define the component using the hook
function ChatBotPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [loading, setLoading] = useState<boolean>(false);
  const [typing, setTyping] = useState<string>('');

  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setTyping("AI Fitness Coach is typing...");

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userChatbotMessage: input }),
      });

      const data = await response.json();
      if (response.ok) {
        handleSubmit(input, data.chatbotResponse);
        // setInput(""); // Ensure this call is within the scope that defines setInput
        //call the handleInputChange function to make setInput = to " "(nothing)
      } else {
        console.error('Failed to send message:', data.error);
      }
    } catch (error: any) {
      console.error('Network or other error:', error.message);
    }

    setLoading(false);
    setTyping(""); // Clear the typing status
  };

  return (
    <main className="w-full min-h-screen bg-blue-200 p-4">
      <div className="max-w-4xl mx-auto sm:ml-64">
        <div className="bg-white border rounded-lg flex flex-col h-[95vh] justify-between">
          <div className="overflow-y-auto p-4 space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2 rounded ${m.role === "user" ? "bg-blue-400 text-white" : "bg-blue-700 text-blue-200"}`}
              >
                <span className="font-bold">{m.role === "user" ? "You: " : "AI: "}</span>
                {m.content}
              </div>
            ))}
             {typing && <div className="bg-sky-100 rounded p-2 text-blue-700">{typing}</div>}
          </div>
          <form onSubmit={handleSubmitForm} className="mt-4">
            <input
              className="w-full p-2 text-white bg-blue-900 border border-blue-600 rounded focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={input}
              placeholder="Ask about nutrition or exercise..."
              onChange={handleInputChange}
              autoComplete="off"
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </main>
  );
}

export default ChatBotPage;
