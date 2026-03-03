import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const resetToken = state?.resetToken;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass1, setShowPass1] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">Invalid reset session</p>
      </div>
    );
  }

  // REAL-TIME PASSWORD MATCH CHECK
  const isMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const isMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleReset = async (e) => {
    e.preventDefault();

    if (!isMatch) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8080/auth/changepassword", {
        resetToken,
        newPassword,
      });

      toast.success("Password changed successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }

    setLoading(false);
  };

  // Dynamic border color classes
  const getBorderColor = () => {
    if (isMatch) return "border-green-500 focus:ring-green-300";
    if (isMismatch) return "border-red-500 focus:ring-red-300";
    return "border-gray-300 focus:ring-blue-300";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        <form onSubmit={handleReset} className="space-y-5">

          {/* NEW PASSWORD */}
          <div className="relative">
            <input
              type={showPass1 ? "text" : "password"}
              className={`w-full border p-3 rounded-lg transition-all ${getBorderColor()}`}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            {/* ONLY ONE EYE BUTTON HERE */}
            <button
              type="button"
              onClick={() => setShowPass1(!showPass1)}
              className="absolute right-3 top-3 text-slate-500"
            >
              {showPass1 ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            className={`w-full border p-3 rounded-lg transition-all ${getBorderColor()}`}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* SUBMIT BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
          </button>

        </form>

        {/* REAL-TIME MATCH INFO */}
        <p className="text-sm mt-3">
          {isMatch && (
            <span className="text-green-600 font-semibold">
              ✔ Passwords match
            </span>
          )}
          {isMismatch && (
            <span className="text-red-600 font-semibold">
              ❌ Passwords do not match
            </span>
          )}
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;