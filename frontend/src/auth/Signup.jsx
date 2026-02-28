import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff, Chrome, Loader2 } from "lucide-react";
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

    // Extract token returned from backend
    const token = res.data.data.VerificationToken;

    // Navigate to verify page
    navigate(`/verify`);

  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Failed to create account");
  }
finally{
 setLoading(false);
};
}
 

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl p-8 w-full max-w-lg">
        
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-900">
            Create Hotdrop Account
          </h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* HOTDROP, USERNAME, EMAIL */}
          {[
            { name: "hotdropId", placeholder: "Hotdrop ID" },
            { name: "username", placeholder: "Username" },
            { name: "email", placeholder: "Email", type: "email" },
          ].map((input, i) => (
            <input
              key={i}
              type={input.type || "text"}
              name={input.name}
              placeholder={input.placeholder}
              value={form[input.name]}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          ))}

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* GENDER */}
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* DOB */}
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            required
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" > Please wait</Loader2>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* OR */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-300"></div>
          <span className="text-xs font-semibold text-slate-500">OR</span>
          <div className="flex-1 h-px bg-slate-300"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <button className="w-full flex items-center justify-center gap-2 border border-slate-300 bg-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
          <Chrome className="h-5 w-5 text-red-500" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;