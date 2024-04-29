import React, { useState } from "react";
import NotFoundMessage from "./NotFoundMessage"; // Ensure the correct import path

function MealPage() {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [nutrients, setNutrients] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  interface MealEntry {
    id: number;
    name: string;
    calories: number;
    nutrients: string;
    date: string;
  }

  const addMeal = () => {
    if (isNaN(Number(calories))) {
      alert("Number(Calories) is not a number | mealPage.tsx, Line 21");
      return;
    }

    // Reset any previous error message
    setErrorMessage("");

    // Validate input
    if (!name.trim() || !calories.trim()) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }
    const newMeal: MealEntry = {
      id: meals.length + 1, // Assuming you use a simple increment for IDs
      name: name,
      calories: Number(calories), // Make sure to convert to the right type if needed
      nutrients: nutrients,
      date: new Date().toISOString(),
    };
    setMeals([...meals, newMeal]);
    // Reset form fields
    setName("");
    setCalories("");
    setNutrients("");
  };

  const deleteMeal = (id: number) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  return (
    <main className="w-full h-screen bg-blue-200">
      <div className="p-4 sm:ml-64 bg-blue-200">
        <div className="p-4 border-2 border-gray-700 border-dashed rounded-lg dark:border-gray-700">
          <div className="p-4 border rounded-lg">
            <h1 className="text-xl font-bold mb-4">Meal Log</h1>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-2 mt-2 border rounded-md border-gray-900"
              placeholder="Name of the Recipe"
              required
            />
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="block w-full px-4 py-2 mt-2 border rounded-md border-gray-900"
              placeholder="Calories"
              required
            />
            <textarea
              value={nutrients}
              onChange={(e) => setNutrients(e.target.value)}
              className="block w-full px-4 py-2 mt-2 mb-4 border rounded-md border-gray-900"
              placeholder="Micro-nutrients (optional)"
            />
            {errorMessage && (
              <div className="mb-3 text-red-500">{errorMessage}</div>
            )}
            <button
              onClick={addMeal}
              className="px-4 py-2 mt-1 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Add Meal
            </button>
          </div>

          <div className="mt-4 p-4 border rounded-lg">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full px-4 py-2 border rounded-md border-gray-900"
              placeholder="Search meals"
              required
            />
            {meals.length === 0 ? (
              <NotFoundMessage itemType="meals" />
            ) : (
              meals
                .filter((meal) =>
                  meal.name.toLowerCase().includes(filter.toLowerCase()),
                )
                .map((meal) => (
                  <div key={meal.id} className="p-2 mt-2 border rounded-lg">
                    <h3>{`${meal.name} - ${meal.calories} Calories`}</h3>
                    <p>{meal.nutrients}</p>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default MealPage;
