"use client";
import React, { useState, useEffect } from "react";
import TooltipMessage from "./TooltipMessage";
import NotFoundMessage from "./NotFoundMessage";
import { timeStamp } from "console";
import { date } from "zod";
import { connectToDatabase } from "@/app/lib/dbConnection";
import { ObjectId } from "mongodb"; // Ensure you import ObjectId

interface Exercise {
  id: string;
  date: string;
  timestamp: string;
  exerciseName: string;
  name: string;
  duration: string;
  calories?: number;
}

function ExercisePage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseInput, setExerciseInput] = useState("");
  const [duration, setDuration] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [exerciseNameFilter, setExerciseNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`; // ISO format
  });
  const [errorState, setErrorState] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [message, setMessage] = useState("");

  const exerciseMessages = [
    "Pump Up, Peace Out!",
    "Fitness Full Circle: Mind, Body, Spirit!",
    "Move More, Stress Less!",
    "Healthy Habits, Happy Heart!",
    "Every Step Counts Towards Balance!",
    "Work Out, Work In Harmony!",
    "Sweat Today, Shine Tomorrow!",
    "Stretch Your Muscles, Not Your Worries!",
    "Track Your Progress, Not Just Performance!",
    "Energize Your Body, Empower Your Mind!"
  ];

  const setRandomExerciseMessage = () => {
    const randomIndex = Math.floor(Math.random() * exerciseMessages.length);
    setLoadingMessage(exerciseMessages[randomIndex]);
  };

  //Data for the dropdown menu
  const commonExercises = [
    "Running",
    "Swimming",
    "Cycling",
    "Weight Lifting",
    "Yoga",
  ];

  const trackExercise = async () => {
    setErrorMessage("");

    // Validation checks
    if (!exerciseInput.trim() || !duration.trim()) {
      setErrorMessage("Please enter both the exercise and duration.");
      setErrorState(true);
      return;
    }

    const nameRegex = /^[a-zA-Z\s\-']+$/; 
    let exercise = nameRegex.test(exerciseInput);

    if (exercise === false) {
      setErrorMessage("Your exercise name should be a word, e.g., Basketball or Kick Boxing");
      setErrorState(true);
      return;
    }

    if (isNaN(Number(duration)) || Number(duration) <= 0) {
      setErrorMessage("Please enter a valid number for duration.");
      setErrorState(true);
      return;
    }
    setRandomExerciseMessage();
    setMessage("Tracking your exercise...");
    setLoadingState(true);

    setTimeout(async () => {
    try {
      const response = await fetch("/api/exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activity: exerciseInput, duration: duration }),
        credentials: "include", // This will include cookies with the request
      });

      const data = await response.json();

      if (response.ok) {
        const currentDateTime = new Date();
        const formattedDate = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1).toString().padStart(2, "0")}-${currentDateTime.getDate().toString().padStart(2, "0")}`;
        const formattedTime = currentDateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Extracts the name before the comma
        const exerciseName = data.data[0].name.split(",")[0].trim();
        const exerciseID = data.exerciseId;

        const newExercise = {
          id: exerciseID,
          timestamp: formattedTime,
          date: formattedDate,
          exerciseName: exerciseInput,
          name: exerciseName,
          duration: data.data[0].duration_minutes,
          calories: data.data[0].total_calories,
        };

        // Update the exercises state
        setExercises((prevEntries) => [newExercise, ...prevEntries]);
        setLoadingState(false);
        setLoadingMessage("");
        setMessage("");
        setExerciseInput("");
        setDuration("");
      } else {
        throw new Error(data.error || "Failed to track the exercise");
      }
    }
     catch (error: any) {
      setErrorMessage(error.message);
      setLoadingState(false);
      setMessage("");
        setLoadingMessage("");
      setErrorState(true);
    }
  }, 2000);
  };

  //Gets all the exercises
  useEffect(() => {
    setLoadingMessage("Getting your exercises from the database :)")
    setLoadingState(true);
    const fetchExercises = async () => {
      try {
        const response = await fetch("/api/getExercises", {
          method: "GET",
          credentials: "include", // to ensure cookies are sent
        });

        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setExercises(
            data
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime(),
              )
              .map((item) => ({
                id: item._id,
                date: new Date(item.timestamp).toISOString().split("T")[0],
                timestamp: new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                exerciseName: item.activity,
                name: item.activity,
                duration: item.duration,
                calories: item.caloriesBurned,
              })),
          );
          setLoadingState(false);
        } else {
          console.error("Received data is not an array:", data);
          setLoadingState(false);
        setLoadingMessage("");
        setErrorMessage("There was an error please try again later :)");
        setErrorState(true);
        }
      } catch (error: any) {
        console.error("Error fetching exercises:", error);
        setErrorMessage(error.message);
        setLoadingState(false);
        setLoadingMessage("");
        setErrorState(true);
      }
    };

    fetchExercises();
  }, [])

  //Allows to delete the exercises
  const deleteExercise = async (id: any) => {
    try {
      console.log(id);
      const response = await fetch("/api/deleteExercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      if (response.ok) {
        setExercises((prevExercises) =>
          prevExercises.filter((exercise) => exercise.id !== id),
        );
      } else {
        throw new Error(data.error || "Failed to delete the exercise");
      }
    } catch (error: any) {
      console.error("Delete exercise error:", error);
      setErrorMessage(error.message || "Failed to delete exercise");
      setErrorState(true);
    }
  };

  // Toggle tooltip visibility
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <main className="w-full min-h-screen bg-blue-200">
      <div className="p-4 md:ml-64">
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
        <div className="mp-4 p-4 max-w-4xl mx-auto">
          <div className="p-4  bg-white shadow-lg border-white border rounded-lg dark:border-white">
            <h1 className="text-xl font-bold mb-4">Exercise</h1>
            <div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={exerciseInput}
                  onChange={(e) => setExerciseInput(e.target.value)}
                  className="block w-full px-4 py-2 mt-2 border rounded-md bg-white border-gray-900"
                  placeholder="Type exercise"
                  list="exercises-list"
                  required
                />
                <button
                  onClick={toggleTooltip}
                  className="block px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                  aria-label="Info"
                >
                  ?
                </button>

                <datalist id="exercises-list">
                  {commonExercises
                    .filter((ex) =>
                      ex.toLowerCase().includes(exerciseInput.toLowerCase()),
                    )
                    .map((filteredExercise) => (
                      <option key={filteredExercise} value={filteredExercise} />
                    ))}
                </datalist>
              </div>
              {showTooltip && (
                 <div
                 className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
                 id="my-modal"
               >
                             <div className="relative top-52 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white">
                   <div className="mt-3">
                     
                     <div className="mt-2 px-7 py-3">
                       <p className="text-sm text-gray-500">
                       <p className="text-black font-bold text-lg">Even if your desired exercise is not in the list, it could still be in the database. Therefore, please don't hesitate to track it by clicking the Track button.</p>
                       </p>
                     </div>
                     <div className="items-center px-4 py-3">
                       <button
                         onClick={() => setShowTooltip(false)}
                         className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                       >
                         Close
                       </button>
                     </div>
                   </div>
                 </div>
                 </div>
                
              )}
              <input
                type="number"
                value={duration}
                min="1"
                onChange={(e) => setDuration(e.target.value)}
                className="block w-full px-4 py-2 mt-2 mb-3 border rounded-md bg-white border-gray-900"
                placeholder="Duration in minutes"
                required
              />
             {errorState && (
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
                id="my-modal"
              >
            <div className="relative top-52 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white">
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
              <button
                type="submit"
                onClick={trackExercise}
                className="px-4 py-2 mt-1 text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Track
              </button>
            </div>
          </div>
          <div className="flex flex-col mt-4 w-full h-full p-4  bg-white shadow-lg border-white border rounded-lg dark:border-white">
            <input
              type="text"
              value={exerciseNameFilter}
              onChange={(e) => setExerciseNameFilter(e.target.value)}
              placeholder="Filter by exercise name"
              className="flex-1 px-4 py-2 border rounded-md bg-white border-gray-900"
            />
            <input
              type="date"
              value={dateFilter} // Already in YYYY-MM-DD format, no need to convert
              onChange={(e) => setDateFilter(e.target.value)} // Directly set the ISO format date
              className="mt-3 px-4 py-2 border rounded-md bg-white border-gray-900"
            />
            <div className="mt-4 p-4 w-full h-96 overflow-y-auto border border-white rounded-lg dark:border-white">
              {exercises.filter(
                (entry) =>
                  entry.name
                    .toLowerCase()
                    .includes(exerciseNameFilter.toLowerCase()) &&
                  entry.date === dateFilter,
              ).length === 0 ? (
                <NotFoundMessage itemType="exercises" />
              ) : (
                exercises
                  .filter(
                    (entry) =>
                      entry.name
                        .toLowerCase()
                        .includes(exerciseNameFilter.toLowerCase()) &&
                      entry.date === dateFilter,
                  )
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="p-2 mt-2 bg-blue-100 border border-gray-900 rounded-lg"
                    >
                      <h3 className="ml-2 mt-2 font-bold">{`Exercise logged at ${entry.timestamp} on ${new Date(entry.date).toLocaleDateString("en-GB")}`}</h3>
                      <div className="bg-blue-100 p-2 border rounded-lg">
                        <h4 className="mt-2 ml-2">
                          {`Exercise Name: ${entry.name}`}
                        </h4>
                        <p className="mt-2 ml-2"> {`Duration: ${entry.duration} mins`}</p>
                        <p className="mt-2 ml-2"> {`Calories Burned: ${entry.calories} kcal`}</p>

                        <button
                          onClick={() => deleteExercise(entry.id)}
                          className="mt-3 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ExercisePage;
