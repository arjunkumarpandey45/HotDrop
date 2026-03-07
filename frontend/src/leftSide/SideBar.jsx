import React from "react";
import {
  Hash,
  LayoutGrid,
  Zap,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";

const Sidebar = () => {
  // 🚀 20+ Consistent Tech Tags
  const trendingTags = [
    "reactjs", "nodejs", "mongodb", "expressjs", "tailwindcss","render",
    "openai_api", "gemini_ai", "framer_motion", "lucide_icons", "emailjs",
    "vite", "shadcn_ui", "axios", "jwt_auth", "machine_learning",
    "neural_networks", "redux_toolkit", "mongoose", "vercel", "postman"
  ];

  return (
    <div className="hidden lg:flex flex-col sticky top-24 w-full max-w-[280px] max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide pb-10 gap-6 select-none">
      
      {/* 🚀 HotDrop Card */}
      <div className="relative flex-shrink-0 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-900 p-6 text-white shadow-xl group cursor-default border border-white/10">
        <span className="absolute left-[-75%] top-0 h-full w-1/2 bg-white/20 skew-x-12 group-hover:left-[130%] transition-all duration-1000"></span>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10">
              <Zap size={14} className="fill-white text-white" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80">v1.0.4</span>
          </div>
          
          <div className="space-y-3 relative z-10">
            <p className="text-[11px] leading-relaxed text-indigo-100 font-medium opacity-90">
              The elite launchpad for developers.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2 group/text">
                <div className="w-1 h-1 rounded-full bg-orange-400 animate-pulse" />
                <p className="text-[10px] font-bold tracking-wide text-white/80 group-hover:text-white transition-colors">
                  Discover & <span className="text-orange-400">Explore</span> projects.
                </p>
              </div>

              <div className="flex items-center gap-2 group/text">
                <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                <p className="text-[10px] font-bold tracking-wide text-white/80 group-hover:text-white transition-colors">
                  <span className="text-blue-300">Drop</span> your Project for reviews.
                </p>
              </div>
            </div>

            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md">
              <Sparkles size={10} className="text-orange-400 animate-spin-slow" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-indigo-100">
                Build • Connect • Scale
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📂 Navigation */}
      <div className="flex flex-col gap-2 px-1 flex-shrink-0">
        <button className="relative overflow-hidden flex items-center justify-between px-5 py-4 rounded-2xl text-white bg-indigo-600 shadow-lg shadow-indigo-100 group transition-all active:scale-95">
          <span className="absolute left-[-75%] top-0 h-full w-1/2 bg-white/20 skew-x-12 group-hover:left-[130%] transition-all duration-700"></span>
          <div className="flex items-center gap-4 relative z-10">
            <LayoutGrid size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest text-white">Global Feed</span>
          </div>
          <ChevronRight size={14} className="relative z-10 opacity-60 text-white" />
        </button>
      </div>

      {/* # Trending Tags (Uniform Cloud) */}
      <div className="flex flex-col gap-5 bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-[0_10px_30px_-15px_rgba(79,70,229,0.1)] mx-1 flex-shrink-0 group/stack">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Hash size={14} className="text-indigo-600 relative z-10" />
              <div className="absolute inset-0 bg-indigo-400/20 blur-md rounded-full scale-150 animate-pulse" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              HotDrop Engine
            </h4>
          </div>
        </div>

        {/* ☁️ All Tags Uniform Style */}
        <div className="flex flex-wrap gap-2.5">
          {trendingTags.map((tag) => (
            <span
              key={tag}
              className="
                relative overflow-hidden
                px-3 py-1.5 bg-white border border-slate-100 
                rounded-xl text-[9px] font-black text-slate-500 
                uppercase tracking-tighter shadow-sm
                transition-all duration-300
                hover:border-indigo-600 hover:text-white 
                hover:-translate-y-1 active:scale-95
                cursor-pointer group/tag
              "
            >
              {/* Uniform Hover Slide Effect */}
              <span className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 translate-y-full group-hover/tag:translate-y-0 transition-transform duration-300" />
              
              <span className="relative z-10 flex items-center gap-1">
                <span className="opacity-40 group-hover/tag:opacity-100">#</span>
                {tag}
              </span>
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100/50">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ">
                Explore the ecosystem
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-indigo-500" />
            <div className="w-1 h-1 rounded-full bg-indigo-400" />
            <div className="w-1 h-1 rounded-full bg-indigo-300" />
          </div>
        </div>
      </div>

      {/* 🛠️ Enhanced Footer Section */}
      <div className="px-6 mt-4 flex flex-col border-t border-slate-50 pt-8 pb-10 flex-shrink-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">
              © 2026 <span className="text-indigo-600 font-black italic">HotDrop</span> 
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-100">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-tighter">Secure</span>
            </div>
          </div>
          <div className="flex items-center justify-between opacity-60">
             <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest ">Built for builders</span>
             <span className="text-[8px] font-black text-indigo-500 uppercase">v1.0.4</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;