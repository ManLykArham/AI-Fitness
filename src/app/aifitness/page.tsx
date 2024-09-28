
"use client";
import React, { useState } from "react";
import Navigation from "../components/Navigation";
import DashboardPage from "../components/dashboardPage";
import ExercisePage from "../components/exercisePage";
import FoodPage from "../components/foodPage";
import MealPage from "../components/mealPage";
import ChatBotPage from "../components/chatbotPage";
import SettingPage from "../components/settingPage";

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Navigation onNavigate={handleNavigation} />
      {currentPage === "dashboard" && <DashboardPage />}
      {currentPage === "exercise" && <ExercisePage />}
      {currentPage === "meal" && <FoodPage />}
      {currentPage === "ownMeal" && <MealPage />}
      {currentPage === "chatbot" && <ChatBotPage />}
      {currentPage === "setting" && <SettingPage />}
    </div>
  );
};

export default Home;
