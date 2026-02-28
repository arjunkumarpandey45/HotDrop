import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://localhost:8080/auth/verification/${token}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setVerified(true);
          toast.success("Email verified successfully!");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          toast.error(data.message || "Verification failed");
          setVerified(false);
        }
      } catch (error) {
        toast.error("Network error");
      }

      setLoading(false);
    };

    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl p-8 w-full max-w-md text-center">

        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-slate-600 font-medium">Verifying your email...</p>
          </div>
        ) : verified ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Email Verified Successfully!
            </h2>
            <p className="text-slate-600 text-sm">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-12 w-12 text-red-600" />
            <h2 className="text-xl font-bold text-slate-900">
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