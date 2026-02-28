import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hotdropId: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    dateOfBirth: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/auth/register",
        form,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success(res.data.message);

      const token = res.data.data.VerificationToken;
      navigate(`/verify`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-md p-6 sm:p-7">

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">

          {/* BASIC FIELDS */}
          {[
            { name: "hotdropId", placeholder: "Hotdrop ID" },
            { name: "username", placeholder: "Full Name" },
            { name: "email", placeholder: "Email Address", type: "email" },
          ].map((input, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                {input.placeholder}
              </label>
              <input
                type={input.type || "text"}
                name={input.name}
                placeholder={input.placeholder}
                value={form[input.name]}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create Password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2.5 px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* GENDER */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option className="text-gray-800" value="male">Male</option>
              <option className="text-gray-800" value="female">Female</option>
              <option className="text-gray-800" value="other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition-all rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-600 mt-5 text-xs">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;