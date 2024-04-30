import React, { useState, useEffect } from "react";
import TooltipMessage from "./TooltipMessage";
import NotFoundMessage from "./NotFoundMessage";

// Define an interface for the food entry if you're using TypeScript, otherwise just use PropTypes
// interface FoodItem {
//   name: string;
//   calories: number;
//   serving_size_g: number;
//   fat_total_g: number;
//   fat_saturated_g: number;
//   protein_g: number;
//   sodium_mg: number;
//   potassium_mg: number;
//   cholesterol_mg: number;
//   carbohydrates_total_g: number;
//   fiber_g: number;
//   sugar_g: number;
//}

interface FoodEntry {
  id: string;
  mealType: string;
  mealName: string;
  timestamp: string;
  date: string;
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
        //console.log(data.data.length)

        //const foodName = data.data[0].name.split(",")[0].trim();
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

        console.log("New entry: " + newEntry);

        setFoodEntries((prevEntries) => [newEntry, ...prevEntries]);

        console.log("New Entry: " + newEntry);
        console.log("Food Entry: " + foodEntries);
        setFoodInput("");
      } else {
        throw new Error(data.error || "Failed to track the food");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const fetchFoods = async () => {
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
          setFoodEntries(data
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
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
        } else {
          console.error("Received data is not an array:", data);
        }
      } catch (error: any) {
        console.error("Error fetching foods:", error);
        setErrorMessage(error.message);
      }
    };
  
    fetchFoods();
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
    }
  };

  // Toggle tooltip visibility
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <main className="w-full min-h-screen bg-blue-200">
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
                    entry.name.toLowerCase().includes(mealNameFilter.toLowerCase()) &&
                    entry.date === dateFilter,
                )
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-blue-100 p-2 mt-2 border border-gray-900 rounded-lg"
                  >
                    <h1>
                      {entry.mealName} - {entry.mealType}
                    </h1>
                    <div className="bg-blue-100 p-2 mt-2 border border-white rounded-lg">
                      <h3 className="font-bold">{`Food logged at ${entry.timestamp} on ${new Date(entry.date).toLocaleDateString("en-GB")}`}</h3>
                      <p>Calories: {entry.calories} kcal</p>
                      <p>Serving Size: {entry.serving_size_g}g</p>
                      <p>
                        Fat: {entry.fat_total_g}g (Saturated: {entry.fat_saturated_g}g)
                      </p>
                      <p>Protein: {entry.protein_g}g</p>
                      <p>Sodium: {entry.sodium_mg}mg</p>
                      <p>Potassium: {entry.potassium_mg}mg</p>
                      <p>Cholesterol: {entry.cholesterol_mg}mg</p>
                      <p>
                        Carbohydrates: {entry.carbohydrates_total_g}g (Fiber: {entry.fiber_g}g, Sugar: {entry.sugar_g}g)
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
