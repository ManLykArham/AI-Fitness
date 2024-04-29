// components/Sidebar.tsx

import React from "react";

type SidebarProps = {
  onNavigate: (page: string) => void; // Prop to handle navigation
};

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  return (
    <div className="rounded-e-xl border-solid border-2 border-gray-900 fixed top-0 left-0 h-full bg-blue-500 text-white w-64">
      <div className="p-5">
        <h1 className="text-lg font-bold text-center">Navigation</h1>
        <ul className="mt-5">
          <li
            onClick={() => onNavigate("dashboard")}
            className="mb-3 text-center cursor-pointer p-2 hover:bg-gray-700 hover:border-solid hover:rounded-xl hover:border-2 hover:border-gray-900"
          >
            Dashboard
          </li>
          <li
            onClick={() => onNavigate("exercise")}
            className="mb-3 text-center cursor-pointer p-2 hover:bg-gray-700 hover:border-solid hover:rounded-xl hover:border-2 hover:border-gray-900"
          >
            Exercise
          </li>
          <li
            onClick={() => onNavigate("food")}
            className="mb-3 text-center cursor-pointer p-2 hover:bg-gray-700 hover:border-solid hover:rounded-xl hover:border-2 hover:border-gray-900"
          >
            Food
          </li>
          <li
            onClick={() => onNavigate("meal")}
            className="mb-3 text-center cursor-pointer p-2 hover:bg-gray-700 hover:border-solid hover:rounded-xl hover:border-2 hover:border-gray-900"
          >
            Meal
          </li>
          <li
            onClick={() => onNavigate("chatbot")}
            className="mb-3 text-center cursor-pointer p-2 hover:bg-gray-700 hover:border-solid hover:rounded-xl hover:border-2 hover:border-gray-900"
          >
            Chatbot
          </li>
          <li
            onClick={() => onNavigate("setting")}
            className="mb-3 text-center cursor-pointer p-2 hover:bg-gray-700 hover:border-solid hover:rounded-xl hover:border-2 hover:border-gray-900"
          >
            Setting
          </li>
          <li
            onClick={() => onNavigate("logout")}
            className="mb-3 text-center cursor-pointer p-2 hover:bg-gray-700 hover:border-solid hover:rounded-xl hover:border-2 hover:border-gray-900"
          >
            Log out
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
