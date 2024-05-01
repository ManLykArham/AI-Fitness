"use client";

import React, { useState } from "react";
import Link from "next/link";
import TnCModal from "./TnCModal";

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
    goals: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setErrorMessage("");

    if (currentStep === 2) {
      // Submit the form
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          window.location.href = "/aifitness"; // Redirect on successful registration
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || "Registration failed");
        }
      } catch (error) {
        console.error("There was an error registering the user", error);
        setErrorMessage("There was an error registering the user");
      }
    } else {
      // Move to the next step
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1); // Go back to the first step
    setErrorMessage(""); // Optionally clear any error messages
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500">
      <div className="w-full max-w-md p-8 space-y-3 rounded-lg bg-white shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">Register</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {currentStep === 1 ? (
            <>
              <div className="flex justify-center items-center">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 mr-2">Name</label>
                <input type="text" id="name" name="name" required className="w-2/3 px-3 py-2 border rounded-md" placeholder="Enter your name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="flex justify-center items-center">
                <label htmlFor="surname" className="text-sm font-medium text-gray-700 mr-2">Surname</label>
                <input type="text" id="surname" name="surname" required className="w-2/3 px-3 py-2 border rounded-md" placeholder="Enter your surname" value={formData.surname} onChange={handleInputChange} />
              </div>
              <div className="flex justify-center items-center">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 mr-2">Email</label>
                <input type="email" id="email" name="email" required className="w-2/3 px-3 py-2 border rounded-md" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="flex justify-center items-center">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mr-2">Password</label>
                <input type="password" id="password" name="password" required className="w-2/3 px-3 py-2 border rounded-md" placeholder="Enter your password" value={formData.password} onChange={handleInputChange} />
              </div>
              <button type="button" onClick={() => setCurrentStep(2)} className="w-full px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Continue</button>
            </>
          ) : (
            <>
              <div className="flex justify-center items-center">
                <label htmlFor="weight" className="text-sm font-medium text-gray-700 mr-2">Weight</label>
                <input type="text" id="weight" name="weight" required className="w-2/3 px-3 py-2 border rounded-md" placeholder="Enter your weight" value={formData.weight} onChange={handleInputChange} />
              </div>
              <div className="flex justify-center items-center">
                <label htmlFor="height" className="text-sm font-medium text-gray-700 mr-2">Height</label>
                <input type="text" id="height" name="height" required className="w-2/3 px-3 py-2 border rounded-md" placeholder="Enter your height" value={formData.height} onChange={handleInputChange} />
              </div>
              <div className="flex justify-center items-center">
                <label htmlFor="goals" className="text-sm font-medium text-gray-700 mr-2">Fitness Goals</label>
                <select id="goals" name="goals" className="w-2/3 px-3 py-2 border rounded-md" value={formData.goals} onChange={handleInputChange}>
                  <option value="cutting">Cutting</option>
                  <option value="bulking">Bulking</option>
                  <option value="maintaining">Maintaining Weight</option>
                </select>
              </div>
              <div className="flex items-center justify-center mt-4">
                <input type="checkbox" id="tnc" name="tnc" className="mr-2" required />
                <label htmlFor="tnc" className="text-sm font-medium text-gray-700">
                  I agree to the <button type="button" onClick={openModal} className="text-blue-600 hover:underline">Terms and Conditions</button>
                </label>
              </div>
              <div className="flex justify-between mt-4">
                <button type="button" onClick={handleBack} className="px-3 py-2 text-black bg-white rounded-md hover:bg-blue-500 border-solid border-2 border-sky-700">Back</button>
                <button type="submit" className="px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Register</button>
              </div>
            </>
          )}
          {errorMessage && (
            <div className="text-sm text-red-600">{errorMessage}</div>
          )}
        </form>
      </div>
      <TnCModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default RegisterPage;
