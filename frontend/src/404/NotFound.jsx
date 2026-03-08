import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MoveLeft, Compass, Shovel } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(7); // Thoda extra time quote padhne ke liye

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (countdown === 0) navigate("/");
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 font-sans select-none relative overflow-hidden">
      
      {/* 🌌 Cyber Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-50/50 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-50/40 blur-[140px] rounded-full animate-pulse delay-1000" />

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* 🧭 Minimal Top Icon */}
        <div className="mb-6 p-3 bg-blue-50 rounded-2xl border border-blue-100/50 shadow-sm text-blue-500">
           <Compass size={24} className="animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* 💎 Shiny Liquid Blue 404 */}
        <div className="relative group cursor-default">
          <h1 className="text-[140px] md:text-[200px] font-[1000] leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-700 via-blue-400 to-cyan-400 animate-gradient-slow drop-shadow-sm">
            404
          </h1>
          {/* Subtle Reflection below 404 */}
          <div className="absolute -bottom-4 left-0 right-0 h-12 bg-gradient-to-t from-blue-100/20 to-transparent blur-xl opacity-50" />
        </div>

        {/* 🖋️ The Deep Quote */}
        <div className="mt-8 max-w-sm space-y-4">
          <p className="text-slate-400 italic font-medium text-sm leading-relaxed px-4">
            "Not all those who wander are lost... some are just looking for a 
            <span className="text-blue-600 font-bold"> better API endpoint</span>."
          </p>
          <div className="h-[1px] w-12 bg-slate-100 mx-auto" />
        </div>

        {/* ⏳ Rerouting Text */}
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
          Rerouting to Home in <span className="text-blue-500">{countdown}s</span>
        </p>

        {/* 🔘 The Glassmorphism Button */}
        <div className="mt-14">
          <Link
            to="/"
            className="group relative flex items-center gap-4 px-10 py-4 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.5)] active:scale-95 overflow-hidden"
          >
            {/* Shiny Shine Animation */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine-fast" />
            
            <MoveLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Return to Launchpad
          </Link>
        </div>
      </div>

      {/* 🔒 Bottom System Tag */}
      <div className="absolute bottom-10 flex items-center gap-2 opacity-30">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-900">
          HotDrop Secure Link
        </span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine-fast {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }
        .animate-shine-fast {
          animation: shine-fast 0.7s ease-in-out;
        }
        @keyframes gradient-slow {
          0%, 100% { background-size: 200% 200%; background-position: left bottom; }
          50% { background-size: 200% 200%; background-position: right top; }
        }
        .animate-gradient-slow {
          animation: gradient-slow 8s ease infinite;
        }
      `}} />
    </div>
  );
};

export default NotFound;