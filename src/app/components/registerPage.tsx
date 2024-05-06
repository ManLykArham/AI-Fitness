"use client";

import React, { useState } from "react";
import Link from "next/link";
function RegisterPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    weight: "",
    height: "",
    goal: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [errorState, setErrorState] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
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

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const isStrongPassword = (password: any) => {
    const regexUpperCase = /[A-Z]/;
    const regexLowerCase = /[a-z]/;
    const regexNumber = /[0-9]/;
    const regexSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

    return (
      password.length >= 8 &&
      regexUpperCase.test(password) &&
      regexLowerCase.test(password) &&
      regexNumber.test(password) &&
      regexSpecialChar.test(password)
    );
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!isStrongPassword(formData.password)) {
      setErrorMessage("Password must be at least 8 characters long and include uppercase, lowercase letters, numbers, and special characters.");
      setErrorState(true);
      return;
    }
    const isValid = validateSignUpInputs(); // Get the validity status
    if (!isValid) {
      setErrorMessage("Validation failed. Please correct your inputs.");
      setErrorState(true);
      return; // Stop further execution if validation fails
    }
    
    setRandomLoadingMessage(); // Set a random well-being message
    setLoadingState(true);
    console.log("Submitting Form Data:", formData); // Debugging log
    setErrorMessage("");

    if (currentStep === 2) {
      setTimeout(async () => { 

      try {
        console.log(formData);
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          window.location.href = "/aifitness";
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || "Registration failed");
          setLoadingState(false);
      setLoadingMessage("");
      setErrorState(true);
        }
      } catch (error) {
        console.error("There was an error registering the user", error);
        setLoadingState(false);
      setLoadingMessage("");
        setErrorState(true);
        setErrorMessage("There was an error registering the user");
      }
    }, 4000);
  }else {
      setCurrentStep(2);
    }
  };

  const validateSignUpInputs = () => {
    const regexString = /^[a-zA-Z\s,]+$/;
    const regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    const testName = regexString.test(formData.name);
    const testSurname = regexString.test(formData.surname);
    const testEmail = regexEmail.test(formData.email);

    if (!testName) {
      alert("Type a proper name");
      return false;
    } else if (!testSurname) {
      alert("Type a proper surname");
      return false;
    } else if (!testEmail || formData.email === "" || formData.email == null) {
      alert("Type a proper email");
      return false;
    }
    return true; // Only return true if all checks pass
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrorMessage("");
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
            <p className="text-black text-center text-sm mt-3">One moment please...</p>
          </p>
        </div>
      </div>
    </div>
  </div>
)}
{showTerms && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
    <div className="relative top-36 mx-auto p-5 border-4 border-solid w-80 shadow-lg rounded-md bg-white">
      <div className="mt-3">
        <h2 className="text-lg font-bold mb-4">Terms and Conditions</h2>
        <div className="text-sm text-left space-y-4 h-60 overflow-y-auto">
          <p><strong>1. Acceptance of Terms</strong><br/>
            By accessing and using AI Fitness, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
          </p>
          <p><strong>2. Service Description</strong><br/>
            AI Fitness is a comprehensive fitness tracking and guidance app that includes:<br/>
            - Calorie and exercise tracking<br/>
            - Personalized AI-driven fitness coaching<br/>
            - Nutritional information and meal tracking
          </p>
          <p><strong>3. Third-Party Services and Data Accuracy</strong><br/>
            Our app integrates third-party databases to provide nutritional and other health-related information. While we strive to provide accurate data, the information may not always be completely accurate or up to date. Users should verify any critical information independently.
          </p>
          <p><strong>4. AI Chatbot</strong><br/>
            AI Fitness includes an AI chatbot designed to offer fitness and health coaching. This AI is not a substitute for professional advice from a qualified healthcare provider. It&apos;s important to consult with a professional for all health-related concerns.
          </p>
          <p><strong>5. Personal Data and Privacy</strong><br/>
            Your privacy is important to us. We use your data to train our AI systems to provide personalized responses and improve service effectiveness.
          </p>
          <p><strong>6. User Responsibilities</strong><br/>
            You are responsible for maintaining the confidentiality of your account details.<br/>
            You agree to provide accurate and complete information about yourself.<br/>
            It is your responsibility to ensure that the use of our app does not contravene local laws or regulations.
          </p>
          <p><strong>7. Prohibited Activities</strong><br/>
            You are prohibited from:<br/>
            - Using the app for any unlawful purpose.<br/>
            - Engaging in any activity that may interfere with or disrupt the service.<br/>
            - Reproducing, duplicating, copying, selling, or reselling any part of the app&apos;s services without express permission.
          </p>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={() => setShowTerms(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      {errorState && (
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
                id="my-modal"
              >
            <div className="relative top-52 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white animate-border-pulse-warning">
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
      <div className="sm:w-1/2 md:w-full max-w-md p-8 space-y-3 rounded-lg bg-white shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">Register</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {currentStep === 1 ? (
            <>
              <div className="text-left mb-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="block w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="text-left mb-2">
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Surname
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  required
                  className="block w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="text-left mb-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="block w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="text-left mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="block w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <div className="text-left mb-2">
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700"
                >
                  Weight: kg
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  id="weight"
                  name="weight"
                  required
                  className="block w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="text-left mb-2">
                <label
                  htmlFor="height"
                  className="block text-sm font-medium text-gray-700"
                >
                  Height: cm
                </label>
                <input
                  type="number"
                  min="0"
                  max="220"
                  id="height"
                  name="height"
                  required
                  className="block w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your height"
                  value={formData.height}
                  onChange={handleInputChange}
                />
              </div>
              <div className="text-left mb-2">
                <label
                  htmlFor="goal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fitness goal
                </label>
                <select
                  id="goal"
                  name="goal"
                  className="block w-full px-3 py-2 border rounded-md"
                  value={formData.goal}
                  onChange={handleInputChange}
                >
                  <option value="">Select your goal</option>
                  <option value="cutting">Cutting</option>
                  <option value="bulking">Bulking</option>
                  <option value="maintaining">Maintaining Weight</option>
                </select>
              </div>

              <div className="text-left mb-2">
                <input
                  type="checkbox"
                  id="tnc"
                  name="tnc"
                  className="mr-2 align-middle"
                  required
                />
                <label
                  htmlFor="tnc"
                  className="text-sm font-medium text-gray-700 align-middle"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3 py-2 text-black bg-white rounded-md hover:bg-blue-500 border-solid border-2 border-sky-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Register
                </button>
              </div>
            </>
          )}
          <div className="mt-4">
            <Link
              href="/login"
              className="inline-block w-full px-3 py-2 text-center text-black bg-white rounded-md hover:bg-blue-500 border border-solid border-blue-700"
            >
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>
          </div>
      
  );
}

export default RegisterPage;
