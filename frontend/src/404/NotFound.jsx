import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MoveLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) navigate("/");
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 font-sans">

      <div className="text-center max-w-md">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 text-red-500 rounded-xl">
            <AlertTriangle size={32}/>
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-7xl font-extrabold text-slate-900 tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold text-slate-700">
          Page Not Found
        </h2>

        {/* Description */}
        

        {/* Developer Quote */}
        <p className="mt-6 text-sm italic text-slate-400">
          "Not all those who wander are lost... some are just looking for a
          <span className="text-blue-600 font-semibold"> better API endpoint</span>."
        </p>

        {/* Skeleton UI */}
        <div className="mt-6 space-y-2 flex flex-col items-center">
          <div className="h-2 w-40 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-2 w-28 bg-slate-200 rounded animate-pulse"></div>
        </div>

        {/* Countdown */}
        <p className="mt-6 text-xs uppercase tracking-widest text-slate-400">
          Redirecting to home in <span className="text-blue-600">{countdown}s</span>
        </p>

        {/* Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            <MoveLeft size={18}/>
            Go to Homepage
          </Link>
        </div>

      </div>

    </div>
  );
};

export default NotFound;