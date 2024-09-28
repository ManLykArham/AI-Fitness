'use client'
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import LandingPage from './landingPage';

function App() {

  const [checkStatus, setCheckStatus] = useState(false);

  const deleteCookie = async () => {
    // Handle error, remove token, and stay on the login page
    const response = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to log out");
    }
    const data = await response.json();
    console.log(data);
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/userAuthentication', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.status === 200) {
          window.location.href = '/aifitness';
        } else if (response.status === 401 || response.status === 500) {
          deleteCookie();
          window.location.href = '/welcome';
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
        deleteCookie();
        window.location.href = '/welcome';
      }
    };
    checkAuthentication();
  
  }, []); // Empty dependency array to ensure it runs only once on mount


  return (
    <main>
      <div className="flex flex-col justify-center items-center min-h-screen w-full m-0 p-0 bg-blue-500">
    </div>
    </main>
  );
}

export default App;
