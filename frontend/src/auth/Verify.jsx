import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "../App.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/auth/verification/${token}`,
          { withCredentials: true }
        );

        // If status is 200 → success
        if (res.status === 200) {
          setVerified(true);
          toast.success("Email verified successfully!");

          // Redirect ONLY on success
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        // Handle error messages correctly
        const msg =
          error.response?.data?.message || "Verification failed, try again!";
        toast.error(msg);

        setVerified(false);
      }

      setLoading(false);
    };

    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 px-4">
      <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8 w-full max-w-md text-center animate-fadeIn">

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center gap-4 animate-slideUp">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-slate-700 text-sm font-medium">
              An email is sent to your Gmail...
            </p>
            <p className="text-slate-700 text-sm font-medium">
              Kindly verify...
            </p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {!loading && verified && (
          <div className="flex flex-col items-center gap-4 animate-slideUp">
            <CheckCircle className="h-14 w-14 text-green-600 animate-bounceSlow" />
            <h2 className="text-2xl font-bold text-slate-900">
              Email Verified!
            </h2>
            <p className="text-slate-600 text-sm">
              Redirecting to login page...
            </p>
          </div>
        )}

        {/* FAILURE STATE */}
        {!loading && !verified && (
          <div className="flex flex-col items-center gap-4 animate-slideUp">
            <XCircle className="h-14 w-14 text-red-600 animate-bounceSlow" />
            <h2 className="text-2xl font-bold text-slate-900">
              Verification Failed
            </h2>
            <p className="text-slate-600 text-sm">
              The verification link is invalid or expired.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Verify;