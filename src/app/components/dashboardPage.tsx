import React, { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title
} from 'chart.js';

// Registering components in ChartJS
ChartJS.register(
  Tooltip, Legend, ArcElement, CategoryScale, LinearScale, Title
);

// Interface definitions for Meals and Exercises
interface Meal {
  mealType: string;
  name: string;
  calories: number;
  timeLogged: string;
}

interface MealsData {
  recentMeals: Meal[];
  totalCalories: number;
}

interface Exercise {
  activity: string;
  duration: string;
  calories: number;
  timeLogged: string;
}

interface ExercisesData {
  recentExercise: Exercise[];
  totalCalories: number;
}

const DashboardPage = () => {
  const [recentMeal, setRecentMeal] = useState<Meal | null>(null);
  const [recentExercise, setRecentExercise] = useState<Exercise | null>(null);
  const [totalCaloriesIntake, setTotalCaloriesIntake] = useState(0);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState<number>(2000);
  const [calorieGoalInput, setCalorieGoalInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingGoal, setEditingGoal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [ errorState, setErrorState] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealsResp, exerciseResp, goalResp] = await Promise.all([
          fetch("/api/getRecentMeal", { method: "GET", credentials: "include" }),
          fetch("/api/getRecentExercise", { method: "GET", credentials: "include" }),
          fetch("/api/getCalorieGoal", { method: "GET", credentials: "include" })
        ]);

        if (!mealsResp.ok) throw new Error("Failed to fetch meals");
        if (!exerciseResp.ok) throw new Error("Failed to fetch exercises");
        if (!goalResp.ok) throw new Error("Failed to fetch calorie goal");

        const mealsData: MealsData = await mealsResp.json();
        const exercisesData: ExercisesData = await exerciseResp.json();
        const { calorieGoal } = await goalResp.json();

        // Process meal data
        if (mealsData.recentMeals.length > 0) {
          const mostRecentMeal = mealsData.recentMeals.sort(
            (a, b) => new Date(b.timeLogged).getTime() - new Date(a.timeLogged).getTime()
          )[0];
          setRecentMeal(mostRecentMeal);
        }
        setTotalCaloriesIntake(mealsData.totalCalories);

        // Process exercise data
        if (exercisesData.recentExercise.length > 0) {
          const mostRecentExercise = exercisesData.recentExercise.sort(
            (a, b) => new Date(b.timeLogged).getTime() - new Date(a.timeLogged).getTime()
          )[0];
          setRecentExercise(mostRecentExercise);
        }
        setTotalCaloriesBurned(exercisesData.totalCalories);

        // Set calorie goal
        setCalorieGoal(calorieGoal);
        setEditingGoal(calorieGoal === 0);  // Enable editing if goal is not set

      } catch (error: any) {
        console.error("Error fetching data:", error.message);
        setErrorMessage(error.message);
        setErrorState(true);
      }
    };

    fetchData();
  }, []);

  const handleSetCalorieGoal = async () => {
    setErrorMessage("");
    if (calorieGoalInput === '') {
      setErrorMessage("Calorie goal input is empty");
      return;
    }
    try {
      const response = await fetch("/api/setCalorieGoal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calorieGoal: parseInt(calorieGoalInput, 10) }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to set calorie goal");
      
      const { calorieGoal } = await response.json();
      setCalorieGoal(calorieGoal);
      setEditingGoal(false);
    } catch (error:any) {
      console.error("Error setting calorie goal:", error);
      setErrorMessage(error.message);
      setErrorState(true);
    }
  };

  // Pie chart data and options setup
  const pieChartData = {
    labels: ['Calories Consumed', 'Remaining Calories'],
    datasets: [
      {
        data: [totalCaloriesIntake, Math.max(0, calorieGoal - totalCaloriesIntake)],
        backgroundColor: ['#B900FF', '#00F121'],
        borderColor: ['#00000', '#00000'],
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)} kcal`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const formatDate = () => {
    const now = new Date();
    // Correctly specify the option types for TypeScript
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', // 'long', 'short', 'narrow'
      year: 'numeric', // 'numeric', '2-digit'
      month: 'short', // 'numeric', '2-digit', 'long', 'short', 'narrow'
      day: 'numeric', // 'numeric', '2-digit'
      hour: '2-digit', // 'numeric', '2-digit'
      minute: '2-digit', // 'numeric', '2-digit'
      hour12: false // Use 24-hour time format without AM/PM
    };
    return now.toLocaleString('en-GB', options);
  };

  return (
    <main className="w-full min-h-screen bg-blue-200">
      <div className="p-4 md:ml-64">
        <div className="mp-4 p-4 max-w-4xl mx-auto">
          <div className="p-4 border border-white bg-white rounded-lg shadow-lg dark:border-white ">
            <div className="sm:flex sm:flex-col sm:-mx-2 ">
              <div className="w-full p-2">
                <div className="flex justify-center p-4 mt-4 border border-white rounded-lg dark:border-white">
                  <p className="font-bold">{`${formatDate()}`}</p>{" "}
                  {/* Display today's date */}
                </div>
              </div>
              
              <div className="w-full p-2">
              <div className="w-full p-4 mt-4 border border-white rounded-lg dark:border-white flex flex-col justify-between items-center">
    {editingGoal ? (
      <>
        <input type="number" min="0" placeholder={`Current calories: ${calorieGoal}kcal`} value={calorieGoalInput} onChange={(e) => setCalorieGoalInput(e.target.value)} className="sm:w-full md:w-1/3 text-lg p-2 border rounded" />
        <div className="sm:flex sm:flex-row sm:-mx-2 sm:text-sm">
          <button onClick={handleSetCalorieGoal} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mt-2">Set Calorie Goal</button>
          <button onClick={() => setShowInfo(true)} className="ml-2 bg-red-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            i
          </button>
        </div>
      </>
    ) : (
      <div className="sm:flex sm:flex-col sm:-mx-2">
        <p className="font-bold">Calorie Goal: {calorieGoal} kcal</p>
        <div>
          <button onClick={() => setEditingGoal(true)} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">Edit Calorie Goal</button>
          <button onClick={() => setShowInfo(true)} className="m-2 bg-red-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            i
          </button>
        </div>
      </div>
    )}
  </div>
              </div>
            </div>
            {showInfo && (
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
                id="my-modal"
              >
                <div className="relative top-52 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Important Information
                    </h3>
                    <div className="mt-2 px-7 py-3">
                      <p className="text-sm text-gray-500">
                        Please be careful when setting your calorie goals.
                        According to NHS, the recommended daily calorie intake
                        for the average person is:
                        <ul className="text-left">
                          <li>2,500kcal for men</li>
                          <li>2,000kcal for women</li>
                        </ul>
                        And when trying to lose weight, the average person
                        should aim to reduce their daily calorie intake by about
                        600kcal. That means reducing calories from the
                        recommended daily allowance to:
                        <ul className="text-left">
                          <li>1,900kcal for men</li>
                          <li>1,400kcal for women</li>
                        </ul>
                        Going below these numbers will put you at risk of
                        developing eating disorders or injuries.
                        <p className="font-bold">
                          Just a reminder: Don&apos;t focus on the numbers, focus on
                          being well overall :)
                        </p>
                      </p>
                    </div>
                    <div className="items-center px-4 py-3">
                      <button
                        onClick={() => setShowInfo(false)}
                        className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Close
                      </button>
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
          </div>
          {/* Container for Calorie Intake and Calories Burned sections */}
          <div className="bg-white rounded-lg mt-3 shadow-lg">
          <div className=" flex flex-wrap -mx-2">
            {/* Total Calorie Intake Section */}
            <div className=" w-1/2 p-2">
              <div className="p-4 mt-4 border border-white rounded-lg dark:border-white">
                <h2 className="text-lg font-semibold">Total Calories Intake</h2>
                <p>{totalCaloriesIntake.toFixed(2)} kcal</p>
                <h1 className="mt-2 font-bold">Recent meal</h1>
                {recentMeal && (
                  <ul>
                    <li>
                      {`${recentMeal.mealType} - ${recentMeal.name}: ${recentMeal.calories.toFixed(2)} kcal at ${new Date(recentMeal.timeLogged).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                    </li>
                  </ul>
                )}
              </div>
            </div>
            {/* Total Calories Burned Section */}
            <div className="w-1/2 p-2">
              <div className="p-4 mt-4 border border-white rounded-lg dark:border-white">
                <h2 className="text-lg font-semibold">Total Calories Burned</h2>
                <p>{totalCaloriesBurned.toFixed(2)} kcal</p>
                <h1 className="mt-2 font-bold">Recent exercise</h1>
                {recentExercise && (
                  <h1>{`Name: ${recentExercise.activity} - ${recentExercise.duration} mins - ${recentExercise.calories.toFixed(2)} kcal at ${new Date(recentExercise.timeLogged).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</h1>
              //     <>
              //     <h1>{`Name: ${recentExercise.activity}`}</h1>
              //     <h1>{`Duration: ${recentExercise.duration} mins`}</h1>
              //     <h1>{`Calories: ${recentExercise.calories.toFixed(2)} kcal`}</h1>
              //     <h1>{`At ${new Date(recentExercise.timeLogged).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</h1>
              //  </>
                )}
              </div>
            </div>
          </div>
          </div>
          {/* Section for Caloric History Graph */}
          <div className="p-4 mt-4 bg-white shadow-lg border border-white rounded-lg dark:border-white">
            <h2 className="text-lg font-semibold">Calories Over Time</h2>
            <div className="w-full p-4 mt-4">
        <h2 className="text-lg font-semibold">Daily Caloric Intake</h2>
        <div className="h-64"> {/* Set a fixed height for the pie chart container */}
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
