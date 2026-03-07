import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/Api";

const VerifyOtp = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtp = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const res = await API.post(`/auth/verifyotp/${email}`, { otp });

      toast.success("OTP Verified");

      navigate("/reset-password", {
        state: { resetToken: res.data.data.resetToken },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Blur BG */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="text-center mb-10">
          <span className="text-blue-600 font-bold text-xl">Verify OTP</span>
        </div>

        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8">
          <p className="text-sm text-slate-500 mb-4 text-center">
            OTP sent to <b>{email}</b>
          </p>

          <form onSubmit={handleOtp} className="space-y-6">
            {/* OTP FIELD */}
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 text-slate-400 group-focus-within:text-blue-500" />
              <input
                type="text"
                required
                placeholder="Enter OTP"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 transition"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
