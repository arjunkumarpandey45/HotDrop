import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Slide, toast, ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "../Toast/toast";

const Login = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const { login, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();const handleSubmit = async (e) => {
  e.preventDefault();

if (loading) return;
  try {
    setLoading(true);

    const result = await login(
      formData.identifier,
      formData.password
    );

    if (result.success) {
     
   showSuccessToast("Happy To See You Again", result.username); 
  
  setTimeout(() => {
    navigate("/");
  }, 1500);;
    } else {
     
      showErrorToast(result.message || "Invalid credentials provided");
    }

  } catch (error) {
   
    showErrorToast("Something went wrong. Please check your connection.");
  } finally {
    setLoading(false); 
  }
};
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans">
    <ToastContainer 
  position="top-center" 
  autoClose={3000}
  hideProgressBar
  closeButton={false}
  theme="light"
  transition={Slide} 
/>
   
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-[400px]">
        
        {/* Branding Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center gap-1.5 items-center">
            <span className="text-2xl font-bold text-orange-500 tracking-tight">HOT</span>
            <span className="text-2xl font-bold text-blue-600 tracking-tight">DROP</span>
          </div>
          <p className="text-slate-500 mt-2 text-sm">
            Ready for your next big project?
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl p-8 md:p-10">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/ID Input */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-2 block ml-1">Email or Hotdrop ID</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="Enter your email or ID"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" hidden className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-right mt-2">
                 <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:underline transition-all">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300
              ${loading ? "bg-blue-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-[0.98]"}`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Logging...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-8 text-center pt-6 border-t border-slate-50">
            <p className="text-sm text-slate-500">
              New to HotDrop?{" "}
              <Link to="/signup" className="text-blue-600 font-bold hover:underline transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 flex justify-center items-center gap-2 text-slate-400">
           <Lock className="h-3 w-3" />
           <span className="text-[10px] font-medium uppercase tracking-wider">Secured by HotDrop Auth</span>
        </div>

      </div>
    </div>
  );
};

export default Login;