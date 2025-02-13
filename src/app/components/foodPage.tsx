import React, { useState, useEffect } from "react";
import NotFoundMessage from "./NotFoundMessage";

interface FoodEntry {
  id: string;
  mealType: string;
  mealName: string;
  timestamp?: string;
  date: string;
  name: string;
  calories: number;
  serving_size_g?: number;
  fat_total_g?: number;
  fat_saturated_g?: number;
  protein_g?: number;
  sodium_mg?: number;
  potassium_mg?: number;
  cholesterol_mg?: number;
  carbohydrates_total_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  showDetails?: boolean,
}

interface MealEntry {
  id: string;
  mealType: string;
  name: string;
  calories: number;
  servingSizeG?: number;
  fatTotalG?: number;
  fatSaturatedG?: number;
  proteinG?: number;
  sodiumMg?: number;
  potassiumMg?: number;
  cholesterolMg?: number;
  carbohydratesTotalG?: number;
  fiberG?: number;
  sugarG?: number;
  date: string;
  showDetails: boolean;
}

function FoodPage() {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [mealType, setMealType] = useState("Breakfast");
  const [foodInput, setFoodInput] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mealNameFilter, setMealNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`; // ISO format
  });
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [showOwnMeal,setShowOwnMeal] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [mealFilter, setMealFilter] = useState("");

  const foodMessages = [
    "Savor the Flavor, Not Just the Number!",
    "Nutrition Matters: Eat Colorful, Live Colorful!",
    "Good Eats, Great Life!",
    "Balance on Your Plate, Balance in Your Life!",
    "Feed Your Body, Nourish Your Soul!",
    "Healthy Choices, Happy You!",
    "Count Blessings, Not Just Calories!",
    "Eat Mindfully, Live Joyfully!",
    "From Kitchen to Confidence!",
    "Wholesome Bites, Wholesome Delights!"
  ];

  const setRandomFoodMessage = () => {
    const randomIndex = Math.floor(Math.random() * foodMessages.length);
    setLoadingMessage(foodMessages[randomIndex]);
  };

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(mealFilter.toLowerCase())
  );

  // Meal types for selection
  const mealTypes = ["Breakfast", "Lunch", "Snack", "Dinner"];
  const commonFoods = [
    "Beans on Toast",
    "Half a Kilo of Chicken",
    "Salad",
    "Apple",
  ];

  // Function to set default meal type based on current time
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 6 && hours < 10) {
      setMealType("Breakfast");
    } else if (hours >= 10 && hours < 14) {
      setMealType("Lunch");
    } else if (hours >= 14 && hours < 21) {
      setMealType("Snack");
    } else {
      setMealType("Dinner");
    }
  }, []);

  // Function to handle tracking new food entries
  const trackFood = async () => {
    setErrorMessage("");

    //Validation
    // Checks if exercise input or duration is empty
    if (!foodInput.trim()) {
      setErrorMessage("Please enter your meal.");
      setErrorState(true);
      return;
    }
    // Removes punctuation from the input, replacing it with spaces
    const sanitizedFoodInput = foodInput
      .replace(/[.,"£\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
      .replace(/\s{2,}/g, " ");
    console.log(sanitizedFoodInput);

    setRandomFoodMessage();
    setMessage("Tracking your food...");
    setLoadingState(true);

    setTimeout(async () => {
    try {
      const response = await fetch("/api/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sanitizedFoodInput,
          mealName: foodInput,
          mealType: mealType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const currentDateTime = new Date();
        const formattedDate = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1).toString().padStart(2, "0")}-${currentDateTime.getDate().toString().padStart(2, "0")}`;
        const formattedTime = currentDateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const foodID = data.foodId;

        const newEntry = {
          id: foodID,
          mealType: data.data.mealType,
          mealName: data.data.mealName,
          timestamp: formattedTime,
          date: formattedDate,
          name: data.data.name,
          calories: data.data.calories,
          serving_size_g: data.data.serving,
          fat_total_g: data.data.fat,
          fat_saturated_g: data.data.fatSat,
          protein_g: data.data.protein,
          sodium_mg: data.data.sodium,
          potassium_mg: data.data.potassium,
          cholesterol_mg: data.data.cholesterol,
          carbohydrates_total_g: data.data.carbohydrates,
          fiber_g: data.data.fiber,
          sugar_g: data.data.sugar,
        };

        setFoodEntries((prevEntries) => [newEntry, ...prevEntries]);
        setFoodInput("");
        setLoadingState(false);
        setLoadingMessage("");
        setMessage("");
      } else {
        throw new Error(data.error || "Failed to track the food");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      setLoadingState(false);
        setLoadingMessage("");
        setMessage("");
      setErrorState(true);
    }
  }, 2000);
  };

  //Tracks the meals that the user has created in the meal page
  const addMeal = async (meal:any) => {
  
    // Destructuring the meal object to access its properties directly
    const { name, calories, mealType, servingSizeG, fatTotalG, fatSaturatedG, proteinG, sodiumMg, potassiumMg, cholesterolMg, carbohydratesTotalG, fiberG, sugarG, date } = meal;

    
  
    // Preparing the data object to be sent to the API
    const mealData = {
      mealName: name,
      name: name,
      calories,
      mealType,
      serving: servingSizeG,
      fat: fatTotalG,
      fatSat: fatSaturatedG,
      protein: proteinG,
      sodium: sodiumMg,
      potassium: potassiumMg,
      cholesterol: cholesterolMg,
      carbohydrates: carbohydratesTotalG,
      fiber: fiberG,
      sugar: sugarG,
      date
    };
    setRandomFoodMessage();
    setMessage("Adding meal...");
    setLoadingState(true);

    setTimeout(async () => {
      try {
      const response = await fetch('/api/trackOwnMeal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealData }),
      });
  
      const data = await response.json();
  
      // Log the server response
      console.log("Server Response:", data);
  
      if (response.ok) {
        const mealID = data.mealId;
        console.log("Meal ID:", mealID);
        console.log("Server Data:", data.data);
  
        const currentDateTime = new Date();
        const formattedDate = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1).toString().padStart(2, "0")}-${currentDateTime.getDate().toString().padStart(2, "0")}`;
        const formattedTime = currentDateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
  
        const newEntry = {
          id: mealID,
          mealType: data.data.mealType,
          mealName: data.data.mealName,
          timestamp: formattedTime,
          date: formattedDate,
          name: data.data.name,
          calories: data.data.calories,
          serving_size_g: data.data.serving,
          fat_total_g: data.data.fat,
          fat_saturated_g: data.data.fatSat,
          protein_g: data.data.protein,
          sodium_mg: data.data.sodium,
          potassium_mg: data.data.potassium,
          cholesterol_mg: data.data.cholesterol,
          carbohydrates_total_g: data.data.carbohydrates,
          fiber_g: data.data.fiber,
          sugar_g: data.data.sugar,
        };
  
        // Optionally update local state with the new entry
        setFoodEntries((prevEntries) => [newEntry, ...prevEntries]);
        resetForm();
        setLoadingState(false);
        setLoadingMessage("");
        setMessage("");
      } else {
        throw new Error(data.error || "Failed to add meal");
      }
    } catch (error:any) {
      console.error("Error in addMeal:", error);
      setErrorMessage(error.message);
      setLoadingState(false);
      setLoadingMessage("");
      setMessage("");
      setErrorState(true);
    }
  }, 2000);
  };
  

  const resetForm = () => {
    setErrorMessage("");
  };

  useEffect(() => {
    const fetchFoods = async () => {
    setLoadingMessage("Getting your meals from the database :)");
    setLoadingState(true);
      try {
        const response = await fetch("/api/getFoods", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch foods");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setFoodEntries(
            data
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime(),
              )
              .map((item) => ({
                id: item._id,
                mealType: item.mealType,
                mealName: item.mealName,
                timestamp: new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                date: new Date(item.timestamp).toISOString().split("T")[0],
                name: item.name,
                calories: item.calories,
                serving_size_g: item.serving_size_g,
                fat_total_g: item.fat_total_g,
                fat_saturated_g: item.fat_saturated_g,
                protein_g: item.protein_g,
                sodium_mg: item.sodium_mg,
                potassium_mg: item.potassium_mg,
                cholesterol_mg: item.cholesterol_mg,
                carbohydrates_total_g: item.carbohydrates_total_g,
                fiber_g: item.fiber_g,
                sugar_g: item.sugar_g,
              })),
          );
          setLoadingState(false);
        setLoadingMessage("");
        } else {
          console.error("Received data is not an array:", data);
        }
      } catch (error: any) {
        console.error("Error fetching foods:", error);
        setErrorMessage(error.message);
        setLoadingState(false);
        setLoadingMessage("");
        setErrorState(true);
      }
    };

    fetchFoods();
  }, []);
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("/api/getMeals", {
          method: "GET",
          credentials: "include", // to ensure cookies are sent
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const data = await response.json();
  
        // Log the complete data array received from the server
        console.log("Data received:", data);
  
        if (Array.isArray(data)) {
          const mappedMeals = data.map((item) => ({
            id: item.id,
            mealType: item.mealType || "N/A", // Default to "N/A" if undefined
            name: item.name || "Unnamed Meal", // Provide a default name
            calories: item.calories || 0, // Default to 0 if undefined
            servingSizeG: item.servingSizeG || 0,
            fatTotalG: item.fatTotalG || 0,
            fatSaturatedG: item.fatSaturatedG || 0,
            proteinG: item.proteinG || 0,
            sodiumMg: item.sodiumMg || 0,
            potassiumMg: item.potassiumMg || 0,
            cholesterolMg: item.cholesterolMg || 0,
            carbohydratesTotalG: item.carbohydratesTotalG || 0,
            fiberG: item.fiberG || 0,
            sugarG: item.sugarG || 0,
            date: new Date(item.date).toISOString().split("T")[0], // Formatting date to YYYY-MM-DD
            showDetails: false, // Default showDetails
          }));
          
          console.log("Mapped Meals:", mappedMeals); // Log the final mapped meals array
          setMeals(mappedMeals);
          setLoadingState(false);
        setLoadingMessage("");
        } else {
          console.error("Received data is not an array:", data);
        }
      } catch (error:any) {
        console.error("Error fetching meals:", error);
        setErrorMessage(error.message || "Failed to fetch meals");
        setLoadingState(false);
        setLoadingMessage("");
        setErrorState(true);
      }
    };
  
    fetchMeals();
  }, []);
  

  // Function to handle deleting a food entry
  const deleteFoodEntry = async (id: any) => {
    try {
      console.log(id);
      const response = await fetch("/api/deleteFood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      if (response.ok) {
        setFoodEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.id !== id),
        );
      } else {
        throw new Error(data.error || "Failed to delete the food");
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
      <div className="p-4 md:ml-64 fade-in">
      {loadingState && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center h-full w-full">
    <div className="relative p-5 border-4 border-solid w-80 shadow-lg rounded-md bg-white animate-border-pulse-load">
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
        <div className="mp-4 p-4 max-w-4xl mx-auto">
          <div className="p-4 border-white bg-white shadow-lg border rounded-lg dark:border-white">
            <h1 className="text-xl font-bold mb-4">Meal Log</h1>
            {!showOwnMeal && (
            <>
            <div className="mb-2">
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="block w-full px-4 py-2 border rounded-md bg-white border-gray-900"
              >
                {mealTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                className="w-full flex-1 px-4 py-2 border rounded-md bg-white border-gray-900"
                placeholder="Type your meal"
                list="foods-list"
                required
              />
              <button
                onClick={toggleTooltip}
                className="block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                aria-label="Info"
              >
                ?
              </button>
              <datalist id="foods-list">
                {commonFoods
                  .filter((food) =>
                    food.toLowerCase().includes(foodInput.toLowerCase()),
                  )
                  .map((filteredFood) => (
                    <option key={filteredFood} value={filteredFood} />
                  ))}
              </datalist>
            </div>
            <button
              onClick={trackFood}
              className="px-4 py-2 mt-1 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Track
            </button>
            </>
)}

            {showOwnMeal && (
              <>
              <div className="mt-4">
          <input
            type="text"
            value={mealFilter}
            onChange={(e) => setMealFilter(e.target.value)}
            placeholder="Filter by meal name"
            className="flex-1 w-full px-4 py-2 border rounded-md bg-white border-gray-900"
          />
        </div>
  <div className="h-60 overflow-y-auto">
  {filteredMeals.length === 0 ? (
            <NotFoundMessage itemType="meals" />
          ) : (
            filteredMeals.map((meal) => (
              <div key={meal.id} className="bg-blue-100 p-2 mt-2 border border-gray-900 rounded-lg">
                <h1>Name: {meal.name}</h1>
                <h1>Type: {meal.mealType}</h1>
                <h1>Calories: {meal.calories} kcal</h1>
                <button
              onClick={() => addMeal(meal)}
              className="px-3 py-1 mt-1 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Track
            </button>
        </div>
      ))
    )}
  </div>
  </>
)}

{showTooltip && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center h-full w-full" id="my-modal">
    <div className="relative p-5 border-4 border-solid w-80 shadow-lg rounded-md bg-white">
      <div className="mt-3">
        <div className="mt-2 px-7 py-3">
          <p className="text-sm text-gray-500">
            <p className="text-black font-bold text-lg">Even if your desired meal is not in the list, it could still be in the database. Therefore, please don&apos;t hesitate to track it by clicking the Track button.</p>
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

             {errorState && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center h-full w-full">
    <div className="relative p-5 border w-80 shadow-lg rounded-md bg-white animate-border-pulse-warning">
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
              onClick={() => setShowOwnMeal(!showOwnMeal)}
              className="ml-3 col-span-2 mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              {showOwnMeal ? "Go Back" : "Add Own Meal"}
            </button>
          </div>

          <div className="flex flex-col mt-4 p-4 w-full h-full bg-white shadow-lg border-white border rounded-lg dark:border-white">
            <input
              type="text"
              value={mealNameFilter}
              onChange={(e) => setMealNameFilter(e.target.value)}
              placeholder="Filter by meal name"
              className="flex-1 px-4 py-2 border rounded-md bg-white border-gray-900"
            />
            <input
              type="date"
              value={dateFilter} // Already in YYYY-MM-DD format, no need to convert
              onChange={(e) => setDateFilter(e.target.value)} // Directly set the ISO format date
              className="mt-3 px-4 py-2 border rounded-md bg-white border-gray-900"
            />

<div className="mt-4 p-4 w-full h-96 overflow-y-auto border border-white rounded-lg dark:border-white">
              {foodEntries.filter(
                (entry) =>
                  entry.name
                    .toLocaleLowerCase()
                    .includes(mealNameFilter.toLowerCase()) &&
                  entry.date === dateFilter,
              ).length === 0 ? (
                <NotFoundMessage itemType="meals" />
              ) : (
                foodEntries
                  .filter(
                    (entry) =>
                      entry.name
                        .toLowerCase()
                        .includes(mealNameFilter.toLowerCase()) &&
                      entry.date === dateFilter,
                  )
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-blue-100 p-2 mt-2 border border-gray-900 rounded-lg"
                    >
                      <h1 className="ml-2 mt-2 font-bold">
                        {`${entry.mealName} - ${entry.mealType} - logged at ${entry.timestamp} on ${new Date(entry.date).toLocaleDateString("en-GB")}`}
                      </h1>
                      <div className="bg-blue-100 p-2 border rounded-lg">
                        <p>Calories: {entry.calories || "N/A"} kcal</p>
                        <p>Serving Size: {entry.serving_size_g || "N/A"}g</p>
                        <p>
                          Fat: {entry.fat_total_g || "N/A"}g (Saturated:{" "}
                          {entry.fat_saturated_g || "N/A"}g)
                        </p>
                        <p>Protein: {entry.protein_g || "N/A"}g</p>
                        <p>Sodium: {entry.sodium_mg || "N/A"}mg</p>
                        <p>Potassium: {entry.potassium_mg || "N/A"}mg</p>
                        <p>Cholesterol: {entry.cholesterol_mg || "N/A"}mg</p>
                        <p>
                          Carbohydrates: {entry.carbohydrates_total_g || "N/A"}g (Fiber:{" "}
                          {entry.fiber_g || 0}g, Sugar: {entry.sugar_g || "N/A"}g)
                        </p>
                        <button
                          onClick={() => deleteFoodEntry(entry.id)}
                          className="px-4 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-700"
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

export default FoodPage;
