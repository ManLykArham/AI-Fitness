import React from "react";

function SettingPage() {
  // State with hardcoded user details
  const [userInfo, setUserInfo] = React.useState({
    email: "arham@gmail.com",
    name: "Arham",
    surname: "Ahmed",
    weight: "84",
    height: "187",
    goal: "cutting", // 'cutting', 'bulking', 'maintaining'
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="w-full h-screen bg-blue-200">
      <div className="p-4 sm:ml-64 bg-blue-200">
        <div className="p-4">
          <div className="bg-white p-6 border-2 border-gray-700 border rounded-lg dark:bg-white dark:border-gray-700">
            <h1 className="text-xl font-bold text-blue-900 dark:text-blue-900 mb-4">
              Settings
            </h1>
            <form>
              {/* Email Input */}
              <div className="mb-4">
                <label
                  className="block text-blue-700 dark:text-blue-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-gray-400 leading-tight focus:outline-none focus:shadow-outline-blue"
                  id="email"
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                />
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label
                  className="block text-blue-700 dark:text-blue-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="shadow appearance-none border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-gray-400 leading-tight focus:outline-none focus:shadow-outline-blue"
                  id="name"
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleChange}
                />
              </div>

              {/* Surname Input */}
              <div className="mb-4">
                <label
                  className="block text-blue-700 dark:text-blue-700 text-sm font-bold mb-2"
                  htmlFor="surname"
                >
                  Surname
                </label>
                <input
                  className="shadow appearance-none border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-gray-400 leading-tight focus:outline-none focus:shadow-outline-blue"
                  id="surname"
                  type="text"
                  name="surname"
                  value={userInfo.surname}
                  onChange={handleChange}
                />
              </div>

              {/* Weight Input */}
              <div className="mb-4">
                <label
                  className="block text-blue-700 dark:text-blue-700 text-sm font-bold mb-2"
                  htmlFor="weight"
                >
                  Weight (kg)
                </label>
                <input
                  className="shadow appearance-none border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-gray-400 leading-tight focus:outline-none focus:shadow-outline-blue"
                  id="weight"
                  type="text"
                  name="weight"
                  value={userInfo.weight}
                  onChange={handleChange}
                />
              </div>

              {/* Height Input */}
              <div className="mb-4">
                <label
                  className="block text-blue-700 dark:text-blue-700 text-sm font-bold mb-2"
                  htmlFor="height"
                >
                  Height (cm)
                </label>
                <input
                  className="shadow appearance-none border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-gray-400 leading-tight focus:outline-none focus:shadow-outline-blue"
                  id="height"
                  type="text"
                  name="height"
                  value={userInfo.height}
                  onChange={handleChange}
                />
              </div>

              {/* Goal Select */}
              <div className="mb-4">
                <label
                  className="block text-blue-700 dark:text-blue-700 text-sm font-bold mb-2"
                  htmlFor="goal"
                >
                  Fitness Goal
                </label>
                <select
                  className="shadow border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-gray-400 focus:outline-none focus:shadow-outline-blue"
                  id="goal"
                  name="goal"
                  value={userInfo.goal}
                  onChange={handleChange}
                >
                  <option value="cutting">Cutting</option>
                  <option value="bulking">Bulking</option>
                  <option value="maintaining">Maintaining Weight</option>
                </select>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SettingPage;
