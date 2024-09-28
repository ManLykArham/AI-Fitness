import React, { useState, useEffect } from "react";
import NotFoundMessage from "./NotFoundMessage";

// Define an interface for each meal entry
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

const MealPage: React.FC = () => {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [mealType, setMealType] = useState("Breakfast");
  const [showNutrients, setShowNutrients] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [servingSizeG, setServingSizeG] = useState<string>("");
  const [fatTotalG, setFatTotalG] = useState<string>("");
  const [fatSaturatedG, setFatSaturatedG] = useState<string>("");
  const [proteinG, setProteinG] = useState<string>("");
  const [sodiumMg, setSodiumMg] = useState<string>("");
  const [potassiumMg, setPotassiumMg] = useState<string>("");
  const [cholesterolMg, setCholesterolMg] = useState<string>("");
  const [carbohydratesTotalG, setCarbohydratesTotalG] = useState<string>("");
  const [fiberG, setFiberG] = useState<string>("");
  const [sugarG, setSugarG] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorState, setErrorState] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [message, setMessage] = useState("");
  const [mealNameFilter, setMealNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`; // ISO format
  });

  const mealMessages = [
    "Craft Your Plate, Control Your Fate!",
    "Design Your Dish, Savor Every Bite!",
    "Mix Nutrients, Match Your Goals!",
    "Calories Count, But So Does Quality!",
    "Plate It Up with Purpose!",
    "Compose, Calculate, Consume!",
    "Every Ingredient Matters!",
    "Build Your Bowl, Boost Your Soul!",
    "Your Meal, Your Masterpiece!",
    "Chef’s Choice: Health & Flavor!"
  ];

  const setRandomMealMessage = () => {
    const randomIndex = Math.floor(Math.random() * mealMessages.length);
    setLoadingMessage(mealMessages[randomIndex]);
  };

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

  const mealTypes = ["Breakfast", "Lunch", "Snack", "Dinner"];

  const addMeal = async () => {
    if (!name || !calories) {
      setErrorMessage("Please fill out all required fields.");
      setErrorState(true);
      return;
    }

    const mealData = {
      mealType: mealType,
      name: name,
      calories: Number(calories) || 0,
      servingSizeG: servingSizeG ? Number(servingSizeG) : undefined,
      fatTotalG: fatTotalG ? Number(fatTotalG) : undefined,
      fatSaturatedG: fatSaturatedG ? Number(fatSaturatedG) : undefined,
      proteinG: proteinG ? Number(proteinG) : undefined,
      sodiumMg: sodiumMg ? Number(sodiumMg) : undefined,
      potassiumMg: potassiumMg ? Number(potassiumMg) : undefined,
      cholesterolMg: cholesterolMg ? Number(cholesterolMg) : undefined,
      carbohydratesTotalG: carbohydratesTotalG
        ? Number(carbohydratesTotalG)
        : undefined,
      fiberG: fiberG ? Number(fiberG) : undefined,
      sugarG: sugarG ? Number(sugarG) : undefined,
      date: new Date().toISOString().split("T")[0],
    };

    setRandomMealMessage();
    setMessage("Storing your meal");
    setLoadingState(true);

    setTimeout(async () => {
      try {
        const response = await fetch("/api/meal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mealData }),
          credentials: "include", // This will include cookies with the request
        });

        const data = await response.json();

        if (response.ok) {
          const mealID = data.mealId;
          console.log("Data: " + mealID);

          const newMeal: MealEntry = {
            id: mealID,
            mealType: mealType,
            name: name,
            calories: Number(calories) || 0,
            servingSizeG: servingSizeG ? Number(servingSizeG) : undefined,
            fatTotalG: fatTotalG ? Number(fatTotalG) : undefined,
            fatSaturatedG: fatSaturatedG ? Number(fatSaturatedG) : undefined,
            proteinG: proteinG ? Number(proteinG) : undefined,
            sodiumMg: sodiumMg ? Number(sodiumMg) : undefined,
            potassiumMg: potassiumMg ? Number(potassiumMg) : undefined,
            cholesterolMg: cholesterolMg ? Number(cholesterolMg) : undefined,
            carbohydratesTotalG: carbohydratesTotalG
              ? Number(carbohydratesTotalG)
              : undefined,
            fiberG: fiberG ? Number(fiberG) : undefined,
            sugarG: sugarG ? Number(sugarG) : undefined,
            date: new Date().toISOString().split("T")[0],
            showDetails: false,
          };
          setMeals((prevMeals) => [
            { ...newMeal, id: data.mealId, showDetails: false },
            ...prevMeals,
          ]);
          resetForm();
          setLoadingState(false);
          setLoadingMessage("");
          setMessage("");
        } else {
          throw new Error(data.error || "Failed to add meal");
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

  useEffect(() => {
    const fetchMeals = async () => {
      setLoadingMessage("Getting your meals from the database");
      setLoadingState(true);
      try {
        const response = await fetch("/api/getMeals", {
          method: "GET",
          credentials: "include", // to ensure cookies are sent
        });

        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          const mappedMeals = data
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((item) => ({
              id: item.id,
              mealType: item.mealType,
              name: item.name,
              calories: item.calories,
              servingSizeG: item.servingSizeG,
              fatTotalG: item.fatTotalG,
              fatSaturatedG: item.fatSaturatedG,
              proteinG: item.proteinG,
              sodiumMg: item.sodiumMg,
              potassiumMg: item.potassiumMg,
              cholesterolMg: item.cholesterolMg,
              carbohydratesTotalG: item.carbohydratesTotalG,
              fiberG: item.fiberG,
              sugarG: item.sugarG,
              date: new Date(item.date).toISOString().split("T")[0], // Formatting date to YYYY-MM-DD
              showDetails: false,
            }));
          setMeals(mappedMeals);
          setLoadingState(false);
          setLoadingMessage("");
          setMessage("");
        } else {
          console.error("Received data is not an array:", data);
        }
      } catch (error: any) {
        console.error("Error fetching meals:", error);
        setErrorMessage(error.message);
        setLoadingState(false);
        setLoadingMessage("");
        setMessage("");
        setErrorState(true);
      }
    };
    fetchMeals();
  }, []);

  function hasNutrientDetails(meal: MealEntry): boolean {
    return (
      meal.servingSizeG !== undefined ||
      meal.fatTotalG !== undefined ||
      meal.fatSaturatedG !== undefined ||
      meal.proteinG !== undefined ||
      meal.sodiumMg !== undefined ||
      meal.potassiumMg !== undefined ||
      meal.cholesterolMg !== undefined ||
      meal.carbohydratesTotalG !== undefined ||
      meal.fiberG !== undefined ||
      meal.sugarG !== undefined
    );
  }

  const resetForm = () => {
    setName("");
    setCalories("");
    setServingSizeG("");
    setFatTotalG("");
    setFatSaturatedG("");
    setProteinG("");
    setSodiumMg("");
    setPotassiumMg("");
    setCholesterolMg("");
    setCarbohydratesTotalG("");
    setFiberG("");
    setSugarG("");
    setShowNutrients(false);
    setErrorMessage("");
  };

  const toggleMealDetails = (id: any): void => {
    setMeals(
      meals.map((meal) =>
        meal.id === id ? { ...meal, showDetails: !meal.showDetails } : meal,
      ),
    );
  };

  const deleteMeal = async (id: any) => {
    try {
      console.log(id);
      const response = await fetch("/api/deleteMeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      if (response.ok) {
        setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id));
      } else {
        throw new Error(data.error || "Failed to delete the meal");
      }
    } catch (error: any) {
      console.error("Delete meal error:", error);
      setErrorMessage(error.message || "Failed to delete meal");
      setErrorState(true);
    }
  };

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(mealNameFilter.toLowerCase()) &&
    meal.date.includes(dateFilter)
  );

  return (
    <main className="w-full min-h-screen bg-blue-200 p-4">
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4">Create your own meal</h1>
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
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Name of the Recipe"
                required
              />
              <input
                type="number"
                value={calories}
                min="0"
                onChange={(e) => setCalories(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Calories"
                required
              />
              <button
                onClick={() => setShowNutrients(!showNutrients)}
                className="col-span-2 mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                {showNutrients ? "Hide Nutrients" : "Add Nutrients"}
              </button>
            </div>
            {showNutrients && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Additional optional input fields for nutrients */}
                <input
                  type="number"
                  value={servingSizeG}
                  min="0"
                  onChange={(e) => setServingSizeG(e.target.value)}
                  className="px-4 py-2 border rounded-md border-gray-900"
                  placeholder="Serving Size (g)"
                />
                <input
                  type="number"
                  value={fatTotalG}
                  min="0"
                  onChange={(e) => setFatTotalG(e.target.value)}
                  className="px-4 py-2 border rounded-md border-gray-900"
                  placeholder="Total Fat (g)"
                />
                <input
                  type="number"
                  value={fatSaturatedG}
                  min="0"
                  onChange={(e) => setFatSaturatedG(e.target.value)}
                  className="px-4 py-2 border rounded-md border-gray-900"
                  placeholder="Saturated Fat (g)"
                />
                <input
                  type="number"
                  value={proteinG}
                  min="0"
                  onChange={(e) => setProteinG(e.target.value)}
                  className="px-4 py-2 border rounded-md border-gray-900"
                  placeholder="Protein (g)"
                />
                <input
                  type="number"
                  value={sodiumMg}
                  min="0"
                  onChange={(e) => setSodiumMg(e.target.value)}
                  className="px-4 py-2 border rounded-md border-gray-900"
                  placeholder="Sodium (mg)"
                />
                <input
                  type="number"
                  value={potassiumMg}
                  min="0"
                  onChange={(e) => setPotassiumMg(e.target.value)}
                  className="px-4 py-2 border rounded-md border-gray-900"
                  placeholder="Potassium (mg)"
                />
                <input
                  type="number"
                  value={cholesterolMg}
                  min="0"
                  onChange={(e) => setCholesterolMg(e.target.value)}
                  className="px-4 py-2 border rounded-md border-gray-900"
                  placeholder="Cholesterol (mg)"
                />
                <input
                  type="number"
                  value={carbohydratesTotalG}
                  min="0"
                  onChange={(e) => setCarbohydratesTotalG(e.target.value)}
                  className="px-4 py-2 border rounded-md border-gray-900"
                  placeholder="Carbohydrates (g)"
                />
                <input
                  type="number"
                  value={fiberG}
                  min="0"
                  onChange={(e) => setFiberG(e.target.value)}
                  className="px-4 py-2 border rounded-md border-gray-900"
                  placeholder="Fiber (g)"
                />
                <input
                  type="number"
                  value={sugarG}
                  min="0"
                  onChange={(e) => setSugarG(e.target.value)}
                  className="px-4 py-2 border rounded-md border-gray-900"
                  placeholder="Sugar (g)"
                />
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
              onClick={addMeal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Add Meal
            </button>
          </div>

          <div className="flex flex-col mt-4 p-4 w-full h-full bg-white shadow-lg border-white border rounded-lg dark:border-white">
            <h2 className="text-xl font-bold mb-4">Your Meals</h2>
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
              {/* Meal list and details toggle */}
              {filteredMeals.length === 0 ? (
                <NotFoundMessage itemType="meals" />
              ) : (
                filteredMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-4 mt-2 border border-gray-900 rounded-lg bg-blue-100 relative"
                  >
                    <h1 className="font-bold">Name: {meal.name}</h1>
                    <h1 className="font-bold">Type: {meal.mealType}</h1>
                    <h1 className="font-bold">Calories: {meal.calories} kcal</h1>

                    {meal.showDetails && (
                      <div className="m-3">
                        {/* Displaying additional nutrient details if present */}
                        {meal.servingSizeG && (
                          <p>Serving Size: {meal.servingSizeG}g</p>
                        )}
                        {meal.fatTotalG && <p>Total Fat: {meal.fatTotalG}g</p>}
                        {meal.fatSaturatedG && (
                          <p>Saturated Fat: {meal.fatSaturatedG}g</p>
                        )}
                        {meal.proteinG && <p>Protein: {meal.proteinG}g</p>}
                        {meal.sodiumMg && <p>Sodium: {meal.sodiumMg}mg</p>}
                        {meal.potassiumMg && <p>Potassium: {meal.potassiumMg}mg</p>}
                        {meal.cholesterolMg && (
                          <p>Cholesterol: {meal.cholesterolMg}mg</p>
                        )}
                        {meal.carbohydratesTotalG && (
                          <p>Carbohydrates: {meal.carbohydratesTotalG}g</p>
                        )}
                        {meal.fiberG && <p>Fiber: {meal.fiberG}g</p>}
                        {meal.sugarG && <p>Sugar: {meal.sugarG}g</p>}
                      </div>
                    )}
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    {hasNutrientDetails(meal) && (
                      <button
                        onClick={() => toggleMealDetails(meal.id)}
                        className="m-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700"
                      >
                        {meal.showDetails ? "Hide Details" : "Show Details"}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MealPage;
