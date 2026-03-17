import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff, Loader2, Sparkles, ChevronRight } from "lucide-react";

import { Slide, ToastContainer } from "react-toastify";
import {  showErrorToastForSIgnup,showSuccessToastForSignup } from "../Toast/toast";
import API from "../api/Api";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    hotdropId: "", username: "", email: "", password: "", gender: "", dateOfBirth: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      showSuccessToastForSignup(res.data.message);
     setTimeout(() => {
    navigate("/verify");
  }, 1500);;
    } catch (error) {
      showErrorToastForSIgnup(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#F8FAFC] flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Soft Background Glows */}
      <ToastContainer 
  position="top-center" 
  autoClose={3000}
  hideProgressBar
  closeButton={false}
  theme="light"
  transition={Slide} 
/>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100/50 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-100/50 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-[550px]">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 mb-3">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-800 tracking-tight">Join HotDrop</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">Create your new account </h2>
        </div>

        {/* Multi-Column Form Card */}
        <div className="bg-white/90 backdrop-blur-md border border-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Row 1: ID & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hotdrop ID</label>
                <input name="hotdropId" value={form.hotdropId} onChange={handleChange} placeholder="hotdropId" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input name="username" value={form.username} onChange={handleChange} placeholder="e.g Alan Walker" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" required />
              </div>
            </div>

            {/* Row 2: Email */}
           <div>
  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
    Email Address
  </label>
  
  <input 
    name="email" 
    type="email" 
    value={form.email} 
    onChange={handleChange} 
    placeholder="name@company.com" 
    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" 
    required 
  />

  {/* Subtle Note - Halka aur Stylish */}
  <div className="flex items-center gap-1.5 ml-1 mt-1">
{/* Chhota sa dot indicator */}
    <p className="text-[10px] leading-tight text-slate-400 font-medium">
      <span className="text-slate-500 font-bold uppercase mr-1 text-[9px]">Note :</span> 
     "Please use the email address currently logged into this device.
    </p>
  </div>
</div>

            {/* Row 3: Password */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-4 pr-11 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Row 4: Gender & DOB (Side by Side) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer" required>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Birth Date</label>
                <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer text-slate-500" required />
              </div>
            </div>

            {/* Compact Submit Button */}
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Complete Registration <ChevronRight size={14} /></>}
            </button>
          </form>

          {/* Minimal Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account? <button onClick={() => navigate("/login")} className="text-blue-600 font-bold hover:underline">Login</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;