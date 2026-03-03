import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const VerifyOtp = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:8080/auth/verifyotp/${email}`,
        { otp }
      );

      toast.success("OTP verified");

      const resetToken = res.data.data.resetToken;

      navigate("/reset-password", { state: { resetToken } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">

        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
        <p className="text-sm text-slate-600 mb-2">OTP sent to <b>{email}</b></p>

        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border p-3 rounded-lg"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify OTP"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default VerifyOtp;