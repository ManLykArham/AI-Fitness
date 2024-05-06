import React, { useState } from "react";
import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Import icons for the toggle button

type SidebarProps = {
  onNavigate: (page: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [message, setMessage] = useState("");

  const goodbyeMessages = [
    "Stay Balanced, Stay Healthy!",
    "Remember: Wellness Over Perfection!",
    "Take Care, Not Count!",
    "Until Next Time, Keep Thriving!",
    "Health First, Counting Second!",
    "Be Kind to Yourself, See You Soon!",
    "Logging Off? Live On Vibrantly!",
    "Keep Smiling, Keep Shining!",
    "Goodbye Calories, Hello Happiness!",
    "Relax, Reflect, Recharge!"
  ];

  const setRandomGoodbyeMessage = () => {
    const randomIndex = Math.floor(Math.random() * goodbyeMessages.length);
    setLoadingMessage(goodbyeMessages[randomIndex]);
  };

  async function logOut() {
    setRandomGoodbyeMessage();
    setMessage("See you next time :)")
    setLoadingState(true);

    setTimeout(async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to log out");
      }
      const data = await response.json();
      console.log(data);
      window.location.href = "/";
      setLoadingState(false);
      setLoadingMessage("");
      setMessage("");
    } catch (error: any) {
      console.error("Error logging out:", error.message);
      setLoadingState(false);
      setLoadingMessage("");
      setMessage("");
      alert("Error Logging out.");
    }
  }, 2000);
  }
  return (
    
    <div className="relative">
            {loadingState && (
  <div
    className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    id="my-modal"
  >
    <div className="relative top-52 mx-auto p-5 border-4 border-solid w-80 shadow-lg rounded-md bg-white animate-border-pulse-load">
      <div className="mt-3">
        <div className="mt-2 px-7 py-3">
          <p className="text-sm text-gray-500">
            {loadingMessage && <p className="text-zinc-900 text-center font-bold text-lg">{loadingMessage}</p>}
          </p>
          <p className="text-sm text-gray-500">
            {message && <p className="text-black text-center text-sm mt-3">{message}</p>}
          </p>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Toggle Button visible only on smaller screens */}
      <div className="md:hidden fixed top-5 left-5 z-30">
        <button className="p-2 bg-blue-500 text-white rounded-full focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
      {/* Sidebar Panel */}
      <div className={`md:translate-x-0 fixed top-0 left-0 h-full w-64 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-20 bg-gray-800 text-white rounded-r-3xl`}>
        <div className="p-5 text-xs sm:text-sm md:text-base">
          <h1 className="text-lg font-bold text-center">Navigation</h1>
          <ul className="mt-5">
            {['dashboard', 'exercise', 'meal', 'own Meal', 'chatbot', 'setting'].map((item) => (
              <li
                key={item}
                onClick={() => { onNavigate(item.replace(' ', '')); setIsOpen(false); }}
                className="mb-3 text-center cursor-pointer p-2 hover:bg-gray-700 hover:border-solid hover:rounded-xl hover:border-2 hover:border-gray-900"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </li>
            ))}
            <li
              onClick={() => { logOut(); setIsOpen(false); }}
              className="mb-3 text-center cursor-pointer p-2 hover:bg-gray-700 hover:border-solid hover:rounded-xl hover:border-2 hover:border-gray-900"
            >
              Log out
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;