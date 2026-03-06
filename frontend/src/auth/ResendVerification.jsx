import React, { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/auth/reverificationmail",
        { email },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Verification email sent");
      setEmail("");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification email"
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white shadow-lg border border-slate-200 rounded-xl p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail className="text-blue-600 w-6 h-6" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Resend Verification Email
          </h2>

          <p className="text-sm text-slate-600 mt-1">
            Enter your email to receive a new verification link
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Sending...
              </>
            ) : (
              "Send Verification Email"
            )}
          </button>

        </form>

        {/* FOOTER */}
        <div className="text-center mt-6 text-sm text-slate-600">
          Already verified?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResendVerification;