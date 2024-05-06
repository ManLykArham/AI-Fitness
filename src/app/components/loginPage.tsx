// LoginPage.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorState, setErrorState] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  
   // Array of well-being focused messages
   const messages = [
    "Fuel Well, Feel Swell!",
    "Beyond Calories: Your Well-being Workshop!",
    "Eat, Move, Smile – Repeat!",
    "Whole Health, Not Just Hole Foods!",
    "Balance is the Best Bite!",
    "Your Health Harmony Hub!",
    "Wellness Wins, Not Just Weight Wanes!",
    "Fit Your Spirit, Not Just Your Jeans!",
    "From Calories to Calm – Your Total Health Tracker!",
    "Thrive Meter: Powered by You!"
  ];

  // Function to set a random message
  const setRandomLoadingMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setLoadingMessage(messages[randomIndex]);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setRandomLoadingMessage(); // Set a random well-being message
    setLoadingState(true);
    setErrorMessage("");
    // Client-side validation can be done here
    setTimeout(async () => {
    try {
      console.log(`Email: ${email}, Password: ${password}`);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensures cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful", data); // Redirect user on successful registration
        window.location.href = "/aifitness";
        setLoadingState(false);
      } else {
        // Handle errors or display messages
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Login failed");
        setLoadingState(false);
        setLoadingMessage("");
        setErrorState(true);
      }
    } catch (error) {
      console.error("There was an error Login the user", error);
      setErrorMessage("There was an error Login the user");
      setLoadingState(false);
      setLoadingMessage("");
      setErrorState(true);
    }
  }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500">
            {loadingState && (
  <div
    className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    id="my-modal"
  >
    <div className="relative top-52 mx-auto p-5 border-4 border-solid w-80 shadow-lg rounded-md bg-white animate-border-pulse-load">
      <div className="mt-3">
        <div className="mt-2 px-7 py-3">
          <p className="text-sm text-gray-500">
            {loadingMessage && <p className="text-green-500 text-center font-bold text-lg">{loadingMessage}</p>}
          </p>
          <p className="text-sm text-gray-500">
            <p className="text-black text-center text-sm mt-3">Logging you in :)</p>
          </p>
        </div>
      </div>
    </div>
  </div>
)}
      {errorState && (
  <div
    className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    id="my-modal"
  >
    <div className="relative top-52 mx-auto p-5 border-4 border-solid w-80 shadow-lg rounded-md bg-white animate-border-pulse-warning">
      <div className="mt-3">
        <div className="mt-2 px-7 py-3">
          <p className="text-sm text-gray-500">
            {errorMessage && <p className="text-red-500 text-lg">{errorMessage}</p>}
          </p>
        </div>
        <div className="items-center px-4 py-3">
          <button
            onClick={() => setErrorState(false)}
            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      <div className="sm:w-1/2 md:w-full max-w-md p-8 space-y-3 rounded-lg bg-white shadow-lg ">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
          <Link href="/register">
            <button className="w-full mt-3 px-3 py-2 text-black hover:text-white bg-white rounded-md hover:bg-blue-500 border-solid border-2 border-sky-700">
              Register
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
