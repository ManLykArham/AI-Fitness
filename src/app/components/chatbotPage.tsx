import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';

interface IMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  isInitial?: boolean;
}

interface IExercise {
  activity: string;
  duration: string; 
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

  const addMessage = (role: 'user' | 'ai' | 'system', content: string, isInitial: boolean = false) => {
    setMessages(prev => [...prev, { id: `msg_${prev.length}`, role, content, isInitial }]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  return { messages, input, addMessage, handleInputChange, setInput, setMessages };
}

function ChatBotPage() {
  const { messages, input, addMessage, handleInputChange, setInput, setMessages } = useChat();
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState(''); 
  const [showChat, setShowChat] = useState(false);
  const [initialMessageShown, setInitialMessageShown] = useState(false);
  const [userHasSentMessage, setUserHasSentMessage] = useState(false);
  const [threadID, setThreadID] = useState('');
  const [userHasSentMessagePer, setUserHasSentMessagePer] = useState(false);
  const [threadIDPer, setThreadIDPer] = useState('');

  useEffect(() => {
    if (showChat && !initialMessageShown) {
      const initialMessage = chatMode === 'personalized'
        ? 'I am an AI-driven chatbot that has been trained to be your fitness coach. I also use your data to provide personalized responses.'
        : 'I am an AI-driven chatbot that has been trained to be your fitness coach.';
      addMessage('system', initialMessage, true);
      setInitialMessageShown(true);
    }
  }, [showChat, chatMode, initialMessageShown, addMessage]);
  

  const handleChatSelection = (mode: 'generic' | 'personalized') => {
    setChatMode(mode);
    setShowChat(true); 
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
    setLoading(true);
    const userDetails = await getUserDetails();
    addMessage('user', input);
    addMessage('system', 'One moment please...'); 
    setInput('');

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
      setMessages(prev => prev.filter(msg => msg.content !== 'One moment please...')); 
      addMessage('ai', chatbotResponse || "No response from AI.");
      setUserHasSentMessage(true);
      setUserHasSentMessagePer(true);
      setThreadID(assistantThreadID);
      setThreadIDPer(assistantThreadIDPer);
    } catch (error) {
      console.error('Failed to communicate with the chatbot:', error);
      setMessages(prev => prev.filter(msg => msg.content !== 'One moment please...')); 
      addMessage('ai', 'Failed to fetch response.');
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-blue-200 p-4">
      <div className="p-4 md:ml-64 fade-in">
        <div className="sm:mt-12 bg-white border rounded-lg flex flex-col h-[85vh] justify-between max-w-4xl mx-auto">
          {!showChat ? (
            <div className="flex justify-center items-center space-x-4 h-[95vh] mx-5">
              <button onClick={() => handleChatSelection('generic')} className=" bg-white text-black p-2 m-3 rounded border-2 border-zinc-700 hover:bg-blue-300 hover:font-bold hover:border-blue-700">Generic Chatbot</button>
              <button onClick={() => handleChatSelection('personalized')} className="bg-blue-500 text-white p-2 m-3 rounded border-2 border-zinc-700 hover:bg-white hover:text-black hover:font-bold hover:border-blue-700">Personalized Chatbot</button>
            </div>
          ) : (
            <div className="bg-white shadow-2xl rounded-lg flex flex-col h-[85vh] justify-between fade-in">
              <div className="overflow-y-auto p-4 space-y-2">
                {messages.map(m => (
                  <div key={m.id} className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-200 text-black' : m.role === 'ai' ? 'bg-blue-600 text-white' : m.isInitial ? 'bg-green-200 text-green-700 font-semibold' : 'bg-yellow-200 text-yellow-700'}`}>
                    {m.content.split('\n').map((line, index) => (
                      <p key={index} className="mb-1">{line}</p>
                    ))}
                  </div>
                ))}
              </div>
              <div>
                <form onSubmit={handleSubmit} className="p-4 flex flex-row justify-center">
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
