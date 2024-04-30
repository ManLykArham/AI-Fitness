import React, { useState, useEffect } from "react";
import NotFoundMessage from "./NotFoundMessage";

// Define an interface for each meal entry
interface MealEntry {
  id: string;
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

  const addMeal = async () => {
    if (!name || !calories) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    const mealData = {
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
      date: new Date().toISOString(),
    };

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
          date: new Date().toISOString(),
          showDetails: false,
        };
        setMeals((prevMeals) => [
          { ...newMeal, id: data.mealId, showDetails: false },
          ...prevMeals,
        ]);
        resetForm();
      } else {
        throw new Error(data.error || "Failed to add meal");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

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

        if (Array.isArray(data)) {
          const mappedMeals = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => ({            
            id: item.id,
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
          
        } else {
          console.error("Received data is not an array:", data);
        }
      } catch (error: any) {
        console.error("Error fetching meals:", error);
        setErrorMessage(error.message);
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
    }
  };

  return (
    <main className="w-full min-h-screen bg-blue-200 p-4">
      <div className="max-w-4xl mx-auto sm:ml-64">
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-xl font-bold mb-4">Add New Meal</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onChange={(e) => setServingSizeG(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Serving Size (g)"
              />
              <input
                type="number"
                value={fatTotalG}
                onChange={(e) => setFatTotalG(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Total Fat (g)"
              />
              <input
                type="number"
                value={fatSaturatedG}
                onChange={(e) => setFatSaturatedG(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Saturated Fat (g)"
              />
              <input
                type="number"
                value={proteinG}
                onChange={(e) => setProteinG(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Protein (g)"
              />
              <input
                type="number"
                value={sodiumMg}
                onChange={(e) => setSodiumMg(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Sodium (mg)"
              />
              <input
                type="number"
                value={potassiumMg}
                onChange={(e) => setPotassiumMg(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Potassium (mg)"
              />
              <input
                type="number"
                value={cholesterolMg}
                onChange={(e) => setCholesterolMg(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Cholesterol (mg)"
              />
              <input
                type="number"
                value={carbohydratesTotalG}
                onChange={(e) => setCarbohydratesTotalG(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Carbohydrates (g)"
              />
              <input
                type="number"
                value={fiberG}
                onChange={(e) => setFiberG(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Fiber (g)"
              />
              <input
                type="number"
                value={sugarG}
                onChange={(e) => setSugarG(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-900"
                placeholder="Sugar (g)"
              />
            </div>
          )}
          {errorMessage && (
            <div className="mt-3 text-red-500">{errorMessage}</div>
          )}
          <button
            onClick={addMeal}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Add Meal
          </button>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Your Meals</h2>
          {/* Meal list and details toggle */}
          {meals.length === 0 ? (
            <NotFoundMessage itemType="meals" />
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="p-4 mt-2 border rounded-lg bg-blue-100 relative">
                <h3 className="font-bold">
                  {meal.name} - {meal.calories} kcal
                </h3>
                {hasNutrientDetails(meal) && (
                  <button
                    onClick={() => toggleMealDetails(meal.id)}
                    className="absolute top-0 right-0 m-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700"
                  >
                    {meal.showDetails ? "Hide Details" : "Show Details"}
                  </button>
                )}
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
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default MealPage;
