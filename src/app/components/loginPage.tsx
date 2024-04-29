// LoginPage.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    // Client-side validation can be done here
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
      } else {
        // Handle errors or display messages
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Login failed");
      }
    } catch (error) {
      console.error("There was an error Login the user", error);
      setErrorMessage("There was an error Login the user");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500">
      <div className="w-full max-w-md p-8 space-y-3 rounded-lg bg-white shadow-lg ">
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
          {errorMessage && <p>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
