import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, Lock } from "lucide-react";
import API from "../api/Api";

const ResetPassword = () => {
  const { state } = useLocation();
  const resetToken = state?.resetToken;
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass1, setShowPass1] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const isMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const borderColor = isMatch
    ? "border-green-500 ring-green-300"
    : isMismatch
    ? "border-red-500 ring-red-300"
    : "border-slate-300";

  const handleReset = async (e) => {
    e.preventDefault();

    if (!isMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/changepassword", {
        resetToken,
        newPassword,
      });

      toast.success("Password Changed Successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }

    setLoading(false);
  };

  if (!resetToken) {
    return <div className="text-red-600 text-center mt-20">Invalid reset session</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans">

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-[400px] bg-white p-8 rounded-3xl shadow-xl border border-slate-200">

        <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Reset Password</h2>

        <form onSubmit={handleReset} className="space-y-6">

          {/* NEW PASSWORD */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 text-slate-400" />

            <input
              type={showPass1 ? "text" : "password"}
              required
              placeholder="Enter new password"
              className={`w-full bg-slate-50 border rounded-xl py-3.5 pl-11 pr-12 text-sm outline-none focus:ring-4 transition ${borderColor}`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              onClick={() => setShowPass1(!showPass1)}
            >
              {showPass1 ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 text-slate-400" />

            <input
              type="password"
              required
              placeholder="Confirm password"
              className={`w-full bg-slate-50 border rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-4 transition ${borderColor}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>

        </form>

        {/* MATCH INDICATOR */}
        <p className="text-center text-sm mt-3">
          {isMatch && (
            <span className="text-green-600 font-semibold">✔ Passwords match</span>
          )}
          {isMismatch && (
            <span className="text-red-600 font-semibold">❌ Passwords don’t match</span>
          )}
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;