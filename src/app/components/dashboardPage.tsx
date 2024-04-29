import React from "react";
import DashboardGraph from "./dashboardGraph";
// If you're going to use a graph library like 'react-chartjs-2', import it here

const DashboardPage: React.FC = () => {
  // Mock data for meals and exercise
  const mealsToday = [
    { meal: "Breakfast", calories: 300, timeLogged: "7:00 AM" },
    { meal: "Lunch", calories: 500, timeLogged: "1:00 PM" },
    { meal: "Dinner", calories: 600, timeLogged: "7:00 PM" },
  ];

  const exercisesToday = [
    { exercise: "Running", caloriesBurned: 350, timeLogged: "8:30 AM" },
    { exercise: "Cycling", caloriesBurned: 400, timeLogged: "5:00 PM" },
  ];

  // // Mock data for the graph
  // const graphData = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Last six months
  //   datasets: [
  //     {
  //       label: 'Calories Gained',
  //       data: [2500, 2700, 2600, 2900, 2800, 3000],
  //       fill: false,
  //       borderColor: 'blue',
  //       tension: 0.1,
  //     },
  //     {
  //       label: 'Calories Lost',
  //       data: [1500, 1600, 1700, 1800, 1900, 2000],
  //       fill: false,
  //       borderColor: 'red',
  //       tension: 0.1,
  //     },
  //   ],
  // };

  const today = new Date().toLocaleDateString();

  // Sample data for the graph
  const data = [
    { month: "Jan", intake: 2200, burned: 1800 },
    { month: "Feb", intake: 2100, burned: 1850 },
    { month: "Mar", intake: 2280, burned: 1900 },
    { month: "Apr", intake: 2180, burned: 1950 },
    { month: "May", intake: 2500, burned: 2000 },
    { month: "Jun", intake: 2400, burned: 2050 },
  ];

  return (
    <main className="w-full h-screen bg-blue-200">
      <div className="p-4 sm:ml-64">
        <div className="mp-4 p-4 border-2 border-gray-700 border-dashed rounded-lg">
          <div className="p-4 border border-white border rounded-lg dark:border-white">
            <h1>Dashboard</h1>
            <p>{new Date().toLocaleDateString()}</p>{" "}
            {/* Display today's date */}
          </div>
          {/* Card for calorie intake */}
          <div className="p-4 mt-4 border border-white border rounded-lg dark:border-white">
            <h2 className="text-lg font-semibold">Calorie Intake</h2>
            <p>Total: 1400 kcal</p> {/* Hardcoded value */}
            <ul>
              {mealsToday.map((meal, index) => (
                <li
                  key={index}
                >{`${meal.meal}: ${meal.calories} kcal at ${meal.timeLogged}`}</li>
              ))}
            </ul>
          </div>
          {/* Card for calories burned */}
          <div className="p-4 mt-4 border border-white border rounded-lg dark:border-white">
            <h2 className="text-lg font-semibold">Calories Burned</h2>
            <p>Total: 750 kcal</p> {/* Hardcoded value */}
            <ul>
              {exercisesToday.map((exercise, index) => (
                <li
                  key={index}
                >{`${exercise.exercise}: ${exercise.caloriesBurned} kcal at ${exercise.timeLogged}`}</li>
              ))}
            </ul>
          </div>
          {/* Graph for calories over six months */}
          <div className="p-4 mt-4 border border-white border rounded-lg dark:border-white">
            <h2 className="text-lg font-semibold">Calories Over Time</h2>
            {/* Render your graph component here, passing `graphData` as the data */}

            <div className="mt-7">
              <DashboardGraph />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
