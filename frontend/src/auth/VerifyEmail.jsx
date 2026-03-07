import React, { useEffect, useState, useRef } from "react";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import API from "../api/Api";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  const requestSent = useRef(false);
  const toastShown = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (requestSent.current) return;
      requestSent.current = true;

      try {
        const res = await API.get(`/auth/verification/${token}`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          if (!toastShown.current) {
            toast.success("Email verified successfully!");
            toastShown.current = true;
          }

          setVerified(true);

          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (err) {
        if (!toastShown.current) {
          toast.error(err.response?.data?.message || "Verification failed!");
          toastShown.current = true;
        }

        setVerified(false);
      }

      setLoading(false);
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      {/* AUTH CARD */}
      <div className="w-full max-w-md bg-white shadow-lg border border-slate-200 rounded-xl p-8">
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Email Verification
          </h2>

          <p className="text-sm text-slate-600 mt-1">
            Confirming your account email
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-slate-600 text-sm">Verifying your email...</p>
          </div>
        )}

        {/* SUCCESS */}
        {!loading && verified && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle className="h-14 w-14 text-green-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Email Verified
            </h2>

            <p className="text-slate-600 text-sm">
              Your account has been successfully verified.
            </p>

            {/* <button
              onClick={() => navigate("/login")}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              Continue to Login
            </button> */}
          </div>
        )}

        {/* FAILURE */}
        {!loading && !verified && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <XCircle className="h-14 w-14 text-red-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Verification Failed
            </h2>

            <p className="text-slate-600 text-sm">
              The verification link is invalid or expired.
            </p>

            <Link
              to="/signup"
              className="w-full mt-3 text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition"
            >
              Back to Registration
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
