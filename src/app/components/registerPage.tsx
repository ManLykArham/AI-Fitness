"use client";

import React, { useState } from "react";
import Link from "next/link";
import TnCModal from "./TnCModal";

function RegisterPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Reset error message
    setErrorMessage("");
    // Client-side validation can be done here
    try {
      console.log(
        `Name: ${name}, Surname: ${surname}, Email: ${email}, Password: ${password}`,
      );
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, surname, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful", data); // Redirect user on successful registration
        window.location.href = "/aifitness";
      } else {
        // Handle errors or display messages
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Registration failed");
      }
    } catch (error) {
      console.error("There was an error registering the user", error);
      setErrorMessage("There was an error registering the user");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500">
      <div className="mt-4 mb-4 w-full max-w-md p-8 space-y-3 rounded-lg bg-white shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h1>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="surname"
              className="text-sm font-medium text-gray-700"
            >
              Surname
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
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
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="tnc"
              name="tnc"
              className="mr-2"
              required
            />
            <label htmlFor="tnc" className="text-sm font-medium text-gray-700">
              I agree to the{" "}
              <button
                type="button"
                onClick={openModal}
                className="text-blue-600 hover:underline"
              >
                Terms and Conditions
              </button>
            </label>
            {errorMessage && (
              <div className="text-center text-sm text-red-600">
                {errorMessage}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
          <Link href="/login">
            <button
              type="submit"
              className="w-full mt-3 px-3 py-2 text-black hover:text-white bg-white rounded-md hover:bg-blue-500 border-solid border-2 border-sky-700"
            >
              LogIn
            </button>
          </Link>
        </form>
      </div>
      <TnCModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default RegisterPage;
