"use client";
import Link from "next/link";

function LandingPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full m-0 p-0 bg-blue-500">
      <div className="xs:w-80 sm:w-full mx-5 max-w-lg p-8 space-y-3 rounded-lg bg-white shadow-lg border-2 border-sky-700 fade-in">
        <h1 className="text-black text-xl sm:text-xl md:text-2xl lg:text-4xl font-bold mb-8 text-center">
          Welcome to AI Fitness
        </h1>
        <div className="flex justify-center space-x-4 content-center">
          <Link href="/login">
            <button className="bg-blue-700 text-white hover:bg-blue-300 hover:text-blue-600 font-bold py-2 px-4 rounded border-solid border-2 border-sky-700 hover:shadow-md">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-white text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded border-solid border-2 border-sky-700 hover:shadow-md">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
