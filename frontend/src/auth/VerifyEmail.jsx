import React, { useEffect, useState, useRef } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "../App.css";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  const requestSent = useRef(false);   // 🛑 Prevent double API calls
  const toastShown = useRef(false);    // 🛑 Prevent duplicate toasts

  useEffect(() => {
    const verifyEmail = async () => {
      if (requestSent.current) return;   // 🛑 STOP second execution
      requestSent.current = true;

      try {
        const res = await axios.get(
          `http://localhost:8080/auth/verification/${token}`,
          { withCredentials: true }
        );

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
  }, [token]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center animate-fadeIn">
        
        {loading && (
          <div className="flex flex-col items-center gap-4 animate-slideUp">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-slate-600 text-sm">Verifying email...</p>
          </div>
        )}

        {!loading && verified && (
          <div className="flex flex-col items-center gap-4 animate-slideUp">
            <CheckCircle className="h-14 w-14 text-green-600 animate-bounceSlow" />
            <h2 className="text-xl font-bold">Email Verified!</h2>
            <p className="text-slate-600 text-sm">Redirecting to login...</p>
          </div>
        )}

        {!loading && !verified && (
          <div className="flex flex-col items-center gap-4 animate-slideUp">
            <XCircle className="h-14 w-14 text-red-600 animate-bounceSlow" />
            <h2 className="text-xl font-bold">Verification Failed</h2>
            <p className="text-slate-600 text-sm">Invalid or expired link.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmailPage;