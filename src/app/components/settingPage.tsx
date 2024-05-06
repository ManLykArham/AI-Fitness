import React, { useState, useEffect } from "react";

interface UserInfo {
  email: string;
  name: string;
  surname: string;
  weight: string;
  height: string;
  goal: string;
  emailError?: string;
  nameError?: string;
  surnameError?: string;
}

interface PasswordResetInfo {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError?: string; 
}

function SettingPage() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    name: "",
    surname: "",
    weight: "",
    height: "",
    goal: "",
    emailError: "",
    nameError: "",
    surnameError: "",
  });

  const [passwords, setPasswords] = useState<PasswordResetInfo>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    emailError: "",
    nameError: "",
    surnameError: ""
  });
  const [error, setError] = useState();
  const [errorState, setErrorState] = useState(false);

  const [showPasswordReset, setShowPasswordReset] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setUserInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setPasswords((prev) => ({ ...prev, [name]: value, passwordError: "" })); // Reset password error when changing fields
    };

  const togglePasswordReset = () => setShowPasswordReset(!showPasswordReset);


  const validateInputs = () => {
    const { email, name, surname } = userInfo;
      // Regular expression for validating an email address
      const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      const nameRegex = /^[a-zA-Z\s\-']+$/; // Allows alphabetic characters, spaces, hyphens, and apostrophes
    
      let newErrors = {
        emailError: emailRegex.test(email) ? "" : "Invalid email address.",
        nameError: nameRegex.test(name) ? "" : "Invalid name.",
        surnameError: nameRegex.test(surname) ? "" : "Invalid surname."
      };
  
      setErrors(newErrors);
  
      // Return false if any errors exist
      return !Object.values(newErrors).some(error => error !== "");
    };

    const handleResetPassword = async () => {
      if (passwords.newPassword !== passwords.confirmPassword) {
        setPasswords(prev => ({ ...prev, passwordError: "New password and confirmation password do not match." }));
        return;
      }
  
      try {
        const response = await fetch("/api/resetPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
          }),
          credentials: "include",
        });
  
        const result = await response.json();
        if (response.ok) {
          alert("Password updated successfully!");
          setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "", passwordError: "" });
          togglePasswordReset();
        } else {
          alert(`Failed to update password: ${result.error}`);
        }
      } catch (error:any) {
        console.error("Error resetting password", error);
        setError(error.message || "Error resetting password. Please check your connection.");
        setErrorState(true); 
      }
    };

  const handleUpdateDetails = async () => {
    if (!validateInputs()) {
      //alert("Please correct the highlighted errors before saving.");
      return;
    }
    console.log("setting:" + userInfo.name);
    try {
      const response = await fetch("/api/updateDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
        credentials: "include",
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Update successful", result);
        alert("Details updated successfully!");
      } else {
        console.error("Failed to update details", result);
        alert("Failed to update details. Please try again.");
      }
    } catch (error:any) {
      console.error("Error updating details", error);
      setError(error.message || "Error updating details. Please check your connection.");
      setErrorState(true);
    }
  };

  // Fetch user details using useEffect
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/getUserDetails", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        if (!data) {
          console.error("No user data received:", data);
        } else {
          const formattedData = {
            email: data.email,
            name: data.name,
            surname: data.surname,
            weight: data.weight,
            height: data.height,
            goal: data.goal,
          };
          setUserInfo(formattedData); // Assuming the first object in array is the user data
        }
      } catch (error: any) {
        console.error("Error fetching user details:", error.message);
        setError(error.message || "Error fetching user details. Please check your connection.");
        setErrorState(true);      
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <main className="w-full min-h-screen bg-blue-200">
            <div className="p-4 md:ml-64">
      <div className="p-4 bg-blue-200 max-w-4xl mx-auto">
        <div className="p-4">
          <div className="bg-white p-6 border-2 border-gray-700 rounded-lg dark:bg-white dark:border-gray-700">
            <h1 className="text-xl font-bold text-blue-900 dark:text-blue-900 mb-4">
              Settings
            </h1>
            {errorState && (
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
                id="my-modal"
              >
            <div className="relative top-52 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    
                    <div className="mt-2 px-7 py-3">
                      <p className="text-sm text-gray-500">
                      {error && <p className="text-red-500 text-lg">{error}</p>}
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
                  className="shadow appearance-none border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-white leading-tight focus:outline-none focus:shadow-outline-blue"
                  id="email"
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                />
                 {errors.emailError && <p className="text-red-500 text-xs italic">{errors.emailError}</p>}
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
                  className="shadow appearance-none border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-white leading-tight focus:outline-none focus:shadow-outline-blue"
                  id="name"
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleChange}
                />
                {errors.nameError && <p className="text-red-500 text-xs italic">{errors.nameError}</p>}
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
                  className="shadow appearance-none border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-white leading-tight focus:outline-none focus:shadow-outline-blue"
                  id="surname"
                  type="text"
                  name="surname"
                  value={userInfo.surname}
                  onChange={handleChange}
                />
                {errors.surnameError && <p className="text-red-500 text-xs italic">{errors.surnameError}</p>}
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
                  className="shadow appearance-none border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-white leading-tight focus:outline-none focus:shadow-outline-blue"
                  id="weight"
                  type="number"
                  min="0"
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
                  className="shadow appearance-none border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-white leading-tight focus:outline-none focus:shadow-outline-blue"
                  id="height"
                  type="number"
                  min="0"
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
                  className="shadow border border-gray-900 rounded w-full py-2 px-3 text-black dark:text-black bg-white focus:outline-none focus:shadow-outline-blue"
                  id="goal"
                  name="goal"
                  value={userInfo.goal}
                  onChange={handleChange}
                >
                  <option value="">Select your goal</option>
                  <option value="cutting">Cutting</option>
                  <option value="bulking">Bulking</option>
                  <option value="maintaining">Maintaining Weight</option>
                </select>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  className="m-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleUpdateDetails}
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  className="m-3 bg-red-200 hover:bg-red-700 hover:text-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={togglePasswordReset}
                >
                  {showPasswordReset ? "Cancel Reset" : "Reset Password"}
                </button>
              </div>
              {showPasswordReset && (
                  <div>
                    <input
                    type="password"
                    name="oldPassword"
                    placeholder="Old Password"
                    onChange={handlePasswordChange}
                    value={passwords.oldPassword}
                    className=" border-gray-900  block w-full px-3 py-2 mt-2 border rounded-md"
                  />
                    {/* New Password Input */}
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      onChange={handlePasswordChange}
                      value={passwords.newPassword}
                      className="border-gray-900 block w-full px-3 py-2 mt-2 border rounded-md"
                    />
                    {/* Confirm New Password Input */}
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      onChange={handlePasswordChange}
                      value={passwords.confirmPassword}
                      className="border-gray-900 block w-full px-3 py-2 mt-2 border rounded-md"
                    />
                    {/* Password error message */}
                    {passwords.passwordError && (
                      <p className="text-red-500 text-xs italic">{passwords.passwordError}</p>
                    )}
                    {/* Update Password Button */}
                    <button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mt-4"
                      onClick={handleResetPassword}
                    >
                      Update Password
                    </button>
                  </div>
                )}
                {/* Remaining form elements and buttons */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SettingPage;