import React, { useState } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../api/Api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const res = await API.post(
        "auth/forgotpassword",
        { email }
      );

      toast.success("OTP sent to your email");
      navigate(`/verify-otp/${email}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans">

      {/* BACKGROUND BLUR */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-[400px]">

        {/* Branding */}
        <div className="text-center mb-10">
          <div className="flex justify-center gap-1.5 items-center">
            <span className="text-2xl font-bold text-orange-500 tracking-tight">HOT</span>
            <span className="text-2xl font-bold text-blue-600 tracking-tight">DROP</span>
          </div>
        </div>

        {/* CARD */}
        <div className="bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl p-8 md:p-10">

          <h2 className="text-lg font-bold text-slate-700 mb-6 text-center">Forgot Password?</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL INPUT */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 text-slate-400 group-focus-within:text-blue-500 transition" />

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 text-white"}`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>
        </div>

        {/* FOOTER */}
        <div className="mt-2 flex justify-center items-center gap-2 text-slate-400">
          <span className="text-[10px] font-medium uppercase tracking-wider">
            Secure HotDrop Recovery
          </span>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;