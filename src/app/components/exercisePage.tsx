"use client";
import React, { useState, useEffect } from "react";
import TooltipMessage from "./TooltipMessage";
import NotFoundMessage from "./NotFoundMessage";
import { timeStamp } from "console";
import { date } from "zod";
import { connectToDatabase } from '@/app/lib/dbConnection';
import { ObjectId } from 'mongodb'; // Ensure you import ObjectId

interface Exercise {
  id: number;
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
      return;
    }

    if (isNaN(Number(duration)) || Number(duration) <= 0) {
      setErrorMessage("Please enter a valid number for duration.");
      return;
    }

    // Preparing the exercise object to be sent to the API
    // const newExercise = {
    //   id: exercises.length + 1,
    //   name: exerciseInput,
    //   duration: duration
    // };
    console.log(exerciseInput);
    console.log(duration);

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

        // Extract the name before the comma
        const exerciseName = data.data[0].name.split(",")[0].trim();
        console.log(exerciseName);

        //Assuming the API returns the exercise data including a generated ID and possibly other info
        const newExercise = {
          id: exercises.length + 1,
          timestamp: formattedTime,
          date: formattedDate,
          exerciseName: exerciseInput,
          name: exerciseName,
          duration: data.data[0].duration_minutes,
          calories: data.data[0].total_calories,
          // Generating the date on the client-side for immediate feedback
        };

        // Update the exercises state
        setExercises((prevEntries) => [newExercise, ...prevEntries]);
        setExerciseInput("");
        setDuration("");
      } else {
        throw new Error(data.error || "Failed to track the exercise");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
        try {
            const response = await fetch('/api/getExercises', {
                method: 'GET',
                credentials: 'include' // to ensure cookies are sent
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch exercises');
            }
            const data = await response.json();
            console.log("AWAITED response.json():" + data);
            if (Array.isArray(data)) {
              setExercises(data.map((item) => ({
                  id: item._id,
                  date: new Date(item.timestamp).toISOString().split('T')[0],
                  timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  exerciseName: item.activity,
                  name: item.activity,
                  duration: item.duration,
                  calories: item.caloriesBurned
              })));
          } else {
              console.error('Received data is not an array:', data);
          }
        } catch (error: any) {
            console.error('Error fetching exercises:', error);
            setErrorMessage(error.message);
        }
    };

    fetchExercises();
}, []);

  // Function to handle deleting an exercise
  // const deleteExercise = (id: number) => {
  //   setExercises(exercises.filter((exercise) => exercise.id !== id));
  // };

//   const deleteExercise = async (id: any) => {
//     try {
//         const response = await fetch(`/api/deleteExercise?id=${id}`, { // Assuming your API route is set up to receive the ID via query parameters
//             method: 'DELETE'
//         });
//         const data = await response.json();

//         if (response.ok) {
//             setExercises(exercises.filter(exercise => exercise.id !== id));
//         } else {
//             throw new Error(data.error || 'Failed to delete the exercise');
//         }
//     } catch (error: any) {
//         console.error('Delete exercise error:', error);
//         setErrorMessage(error.message || 'Failed to delete exercise');
//     }
// };

const deleteExercise = async (id: any) => {
  try {
    const response = await fetch("/api/deleteExercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
      const data = await response.json();

      if (response.ok) {
          setExercises(exercises.filter((exercise) => exercise.id !== id));
      } else {
          throw new Error(data.error || 'Failed to delete the exercise');
      }
  } catch (error: any) {
      console.error('Delete exercise error:', error);
      setErrorMessage(error.message || 'Failed to delete exercise');
  }
};


  // Toggle tooltip visibility
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <main className="w-full h-screen bg-blue-200">
      <div className="p-4 ">
        <div className="mp-4 p-4 sm:ml-64 border-2 border-gray-700 border-dashed rounded-lg">
          <div className="p-4 border border-white border rounded-lg dark:border-white">
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
                <TooltipMessage
                  onClose={() => setShowTooltip(false)}
                  message="Even if your desired exercise is not in the list, it could still be in the database. Therefore, please don't hesitate to track it by clicking the Track button."
                />
              )}
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="block w-full px-4 py-2 mt-2 mb-3 border rounded-md bg-white border-gray-900"
                placeholder="Duration in minutes"
                required
              />
              {errorMessage && (
                <div className="mb-2 text-red-500 p-2">{errorMessage}</div>
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
          <div className="mt-4 p-4 w-full h-full p-4 border border-white border rounded-lg dark:border-white">
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
              className="m-3 px-4 py-2 border rounded-md bg-white border-gray-900"
            />
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
                    <h3 className="font-bold">{`Exercise logged at ${entry.timestamp} on ${new Date(entry.date).toLocaleDateString("en-GB")}`}</h3>
                    <div className="bg-blue-100 p-2 mt-2 border border-white rounded-lg">
                      <h4 className="mt-2 ml-2 font-semibold">{entry.name}</h4>
                      <p className="mt-2 ml-2">{entry.duration} mins</p>
                      <p className="mt-2 ml-2">{entry.calories} kcal</p>

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
    </main>
  );
}

export default ExercisePage;
