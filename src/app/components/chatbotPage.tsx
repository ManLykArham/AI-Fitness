import React, { useState, FormEvent, ChangeEvent } from 'react';

interface IMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

interface IExercise {
  activity: string;
  duration: string; // Assuming duration is a string, convert if necessary
  caloriesBurned: number;
  timestamp: Date;
}

interface IMeal {
  mealName: string;
  mealType: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  timestamp: Date;
}


function useChat() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');

  const addMessage = (role: 'user' | 'ai', content: string) => {
    setMessages(prev => [...prev, { id: `msg_${prev.length}`, role, content }]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  return { messages, input, addMessage, handleInputChange, setInput };
}

function ChatBotPage() {
  const { messages, input, addMessage, handleInputChange, setInput } = useChat();
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState(''); // Keep empty initially
  const [showChat, setShowChat] = useState(false);
  const [userHasSentMessage, setUserHasSentMessage] = useState(false);
  const [threadID, setThreadID] = useState('');
  const [userHasSentMessagePer, setUserHasSentMessagePer] = useState(false);
  const [threadIDPer, setThreadIDPer] = useState('');

  const handleChatSelection = (mode: 'generic' | 'personalized') => {
    setChatMode(mode);
    setShowChat(true); // This will display the chat interface
  };

  const formatActivities = (exercises: IExercise[], meals: IMeal[]) => {
    const exerciseSummary = exercises.map(ex => 
      `${ex.activity} for ${ex.duration} minutes, burning ${ex.caloriesBurned} calories on ${ex.timestamp.toLocaleDateString()}`
    ).join('. ');
  
    const mealSummary = meals.map(meal => 
      `${meal.mealName} consisting of ${meal.calories} calories, ${meal.protein}g protein, and ${meal.carbohydrates}g carbs on ${meal.timestamp.toLocaleDateString()}`
    ).join('. ');
  
    return { exerciseSummary, mealSummary };
  };
  
  

  const getUserDetails = async () => {
    try {
      const response = await fetch("/api/userDetails", {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
  
      const data = await response.json();
      const exercises: IExercise[] = data.data.exercises.map((ex: any) => ({
        ...ex,
        timestamp: new Date(ex.timestamp)
      }));
      const meals: IMeal[] = data.data.meals.map((meal: any) => ({
        ...meal,
        timestamp: new Date(meal.timestamp)
      }));
  
      const { exerciseSummary, mealSummary } = formatActivities(exercises, meals);
  
      return {
        ...data.data.user,
        exerciseSummary,
        mealSummary
      };   
    } catch (error: any) {
      console.error("Error fetching user details:", error);
    }
  };
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userDetails = await getUserDetails();
    setLoading(true);
    setInput('');
    addMessage('user', input);

    const endpoint = chatMode === 'personalized' ? '/api/initializeChat' : '/api/chat';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userChatbotMessage: input, userDetails, userHasSentMessage, userHasSentMessagePer, threadID, threadIDPer }),
      });
      if (!response.ok) {
        throw new Error("Failed to set calorie goal");
      }
      const { chatbotResponse, assistantThreadID, assistantThreadIDPer } = await response.json();
      addMessage('ai', chatbotResponse || "No response from AI.");
      setUserHasSentMessage(true);
      setUserHasSentMessagePer(true);
      setThreadID(assistantThreadID);
      setThreadIDPer(assistantThreadIDPer);
    } catch (error) {
      console.error('Failed to communicate with the chatbot:', error);
      addMessage('ai', 'Failed to fetch response.');
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-blue-200 p-4">
      <div className="p-4 md:ml-64">
        <div className="mt-12 bg-white border rounded-lg flex flex-col h-[85vh] justify-between max-w-4xl mx-auto">
          {!showChat ? (
            <div className="flex justify-center items-center space-x-4 h-[95vh]">
              <button onClick={() => handleChatSelection('generic')} className="bg-white text-black p-2 m-3 rounded border-2 border-zinc-700 hover:bg-blue-300 hover:font-bold hover:border-blue-700">Generic Chatbot</button>
              <button onClick={() => handleChatSelection('personalized')} className="bg-blue-500 text-white p-2 m-3 rounded border-2 border-zinc-700 hover:bg-white hover:text-black hover:font-bold hover:border-blue-700">Personalized Chatbot</button>
            </div>
          ) : (
            <div className="bg-white border rounded-lg flex flex-col h-[95vh] justify-between">
              <div className="overflow-y-auto p-4 space-y-2">
                {messages.map(m => (
                  <div key={m.id} className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-400 text-white' : 'bg-blue-700 text-blue-200'}`}>
                    {m.content}
                  </div>
                ))}
              </div>
              <div>
              <form onSubmit={handleSubmit} className="p-4 flex flex-row">
                <input
                  className="p-2 border border-blue-600 rounded focus:outline-none w-3/4 text-lg"
                  value={input}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Ask me anything"
                />
                <button type="submit" className="ml-5 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded disabled:opacity-50" disabled={loading || input.trim() === ''}>
                  Send
                </button>
              </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
  
}

export default ChatBotPage;