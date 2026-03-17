import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import API from "../api/Api";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await API.get(
          `/auth/verification/${token}`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          setVerified(true);
          toast.success("Email verified successfully!");

          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        const msg =
          error.response?.data?.message || "Verification failed!";
        toast.error(msg);
        setVerified(false);
      }

      setLoading(false);
    };

    if (token) verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-slate-200">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Mail className="text-blue-600 w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
             Verification Email Sent To Your G-MAIL
          </h2>

          <p className="text-sm text-slate-400 mt-1">
             If email not found at primary inbox, please check in spam or junk folder
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="animate-spin text-blue-600 w-14 h-14" />

            
          </div>
        )}

        {/* SUCCESS */}
        {!loading && verified && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">

            <CheckCircle className="text-green-600 w-12 h-12" />

            <h3 className="text-lg font-semibold text-slate-900">
              Email Verified
            </h3>

            <p className="text-sm text-slate-600">
              Your email has been successfully verified.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              Continue to Login
            </button>

          </div>
        )}

        {/* FAILED */}
        {!loading && !verified && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">

            <XCircle className="text-red-600 w-12 h-12" />

            <h3 className="text-lg font-semibold text-slate-900">
              Verification Failed
            </h3>

            <p className="text-sm text-slate-600">
              This verification link is invalid or expired.
            </p>

            <Link
              to="/login"
              className="w-full mt-3 text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition"
            >
              Back to Login
            </Link>

          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;