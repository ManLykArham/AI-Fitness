import React, { useState, useEffect } from "react";
import TooltipMessage from "./TooltipMessage";
import NotFoundMessage from "./NotFoundMessage";

// Define an interface for the food entry if you're using TypeScript, otherwise just use PropTypes
interface FoodItem {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

interface FoodEntry {
  id: number;
  mealType: string;
  mealName: string;
  timestamp: string;
  date: string;
  foods: FoodItem[]; // Array of FoodItem objects
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
    // Reset the error message each time the function is called
    setErrorMessage("");

    // Check if exercise input or duration is empty
    if (!foodInput.trim()) {
      setErrorMessage("Please enter your meal.");
      return; // Stop the execution if there's an error
    }
    // Remove punctuation from the input, replacing it with spaces
    const sanitizedFoodInput = foodInput
      .replace(/[.,"£\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
      .replace(/\s{2,}/g, " ");

    console.log(sanitizedFoodInput);

    try {
      const response = await fetch("/api/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: sanitizedFoodInput }),
      });

      const data = await response.json();

      if (response.ok) {
        const currentDateTime = new Date();
        const formattedDate = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1).toString().padStart(2, "0")}-${currentDateTime.getDate().toString().padStart(2, "0")}`;
        const formattedTime = currentDateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const newEntry = {
          id: foodEntries.length + 1,
          mealType: mealType,
          mealName: foodInput,
          timestamp: formattedTime,
          date: formattedDate,
          foods: data.data,
        };

        setFoodEntries((prevEntries) => [newEntry, ...prevEntries]);
        setFoodInput("");
      } else {
        throw new Error(data.error || "Failed to track the food");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  // Function to handle deleting a food entry
  const deleteFoodEntry = (id: number) => {
    setFoodEntries(foodEntries.filter((entry) => entry.id !== id));
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
            <h1 className="text-xl font-bold mb-4">Food Log</h1>
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
                className="flex-1 px-4 py-2 border rounded-md bg-white border-gray-900"
                placeholder="Type your meal"
                list="foods-list"
                required
              />
              <button
                onClick={toggleTooltip}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
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
            {showTooltip && (
              <TooltipMessage
                onClose={toggleTooltip}
                message="Even if your desired meal is not in the dropdown menu, it could still be in the database. Therefore, please don't hesitate to check it by clicking the Track button."
              />
            )}
            {errorMessage && (
              <div className="mb-2 text-red-500 p-2">{errorMessage}</div>
            )}
            <button
              onClick={trackFood}
              className="px-4 py-2 mt-1 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Track
            </button>
          </div>

          <div className="mt-4 p-4 w-full h-full p-4 border border-white border rounded-lg dark:border-white">
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
              className="m-3 px-4 py-2 border rounded-md bg-white border-gray-900"
            />

            <div className="mt-4 p-4 w-full h-full border border-white rounded-lg dark:border-white">
              {foodEntries.filter(
                (entry) =>
                  entry.mealName
                    .toLowerCase()
                    .includes(mealNameFilter.toLowerCase()) &&
                  entry.date === dateFilter,
              ).length === 0 ? (
                <NotFoundMessage itemType="meals" />
              ) : (
                foodEntries
                  .filter(
                    (entry) =>
                      entry.mealName
                        .toLowerCase()
                        .includes(mealNameFilter.toLowerCase()) &&
                      entry.date === dateFilter,
                  )
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-blue-100 p-2 mt-2 border border-gray-900 rounded-lg"
                    >
                      <h1>{entry.mealName}</h1>
                      <div className="bg-blue-100 p-2 mt-2 border border-white rounded-lg">
                        <h3>{`${entry.mealType} at ${entry.timestamp} on ${new Date(entry.date).toLocaleDateString("en-GB")}`}</h3>

                        {entry.foods.map((food) => (
                          <div
                            key={food.name}
                            className="p-2 mt-2 bg-white border border-gray-700 rounded-lg"
                          >
                            <h4 className="font-bold">{food.name}</h4>
                            <p>Calories: {food.calories.toFixed(2)} kcal</p>
                            <p>Serving Size: {food.serving_size_g}g</p>
                            <p>
                              Fat: {food.fat_total_g}g (Saturated:{" "}
                              {food.fat_saturated_g}g)
                            </p>
                            <p>Protein: {food.protein_g}g</p>
                            <p>Sodium: {food.sodium_mg}mg</p>
                            <p>Potassium: {food.potassium_mg}mg</p>
                            <p>Cholesterol: {food.cholesterol_mg}mg</p>
                            <p>
                              Carbohydrates: {food.carbohydrates_total_g}g
                              (Fiber: {food.fiber_g}g, Sugar: {food.sugar_g}g)
                            </p>
                          </div>
                        ))}
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
