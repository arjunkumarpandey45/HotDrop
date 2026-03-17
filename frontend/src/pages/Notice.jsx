import React, { useState } from "react";
import { Megaphone, AlertTriangle, Bug, Mail, ChevronRight, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Notice = () => {
  const [showWarning, setShowWarning] = useState(true);

  const notices = [
    {
      id: 1,
      title: "Welcome to HotDrop! 🎉",
      description: "Start dropping your projects, sharing your portfolio, and connecting with top creators.",
      date: "Just now",
      isNew: true,
    },
    {
      id: 2,
      title: "New Feature: Search Profiles",
      description: "You can now search for other developers using their HotDrop ID in the navbar.",
      date: "2 days ago",
      isNew: false,
    }
  ];

  return (
    // 🔥 ADDED: This outer wrapper centers everything on the screen
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FAFAFA]">
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden flex flex-col relative">
        
        {/* Subtle Ambient Glow behind the widget */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER */}
        <div className="flex items-center gap-3.5 px-6 py-5 border-b border-slate-100/50 bg-white/50 relative z-10">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-500/20">
            <Megaphone size={18} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900 leading-none mb-1">Notice Board</h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
              <Sparkles size={10} /> Updates & Alerts
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col gap-5 relative z-10">
          
          {/* 🔥 UNDER PRODUCTION WARNING CARD */}
          {showWarning && (
            <div className="relative bg-gradient-to-br from-orange-50 to-red-50/50 border border-orange-200/50 rounded-2xl p-4 pr-10 shadow-sm overflow-hidden group/warning">
              {/* Decorative background glow */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl transition-opacity group-hover/warning:opacity-100 opacity-50 pointer-events-none" />
              
              <button 
                onClick={() => setShowWarning(false)}
                className="absolute top-3 right-3 text-orange-400 hover:text-orange-600 hover:bg-orange-100 p-1.5 rounded-full transition-all z-20"
              >
                <X size={14} strokeWidth={3} />
              </button>
              
              <div className="flex items-start gap-3 relative z-10">
                <div className="mt-0.5 p-1.5 bg-white/80 rounded-lg shadow-sm border border-orange-100 text-orange-500">
                  <AlertTriangle size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[13px] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-1 tracking-tight">APP UNDER PRODUCTION</h3>
                  <p className="text-[11px] font-medium leading-relaxed text-orange-800/70 mb-3">
                    HotDrop is currently in active development. You might experience some unexpected glitches. 
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600/80 uppercase tracking-wider">
                      <Bug size={12} /> Find a bug?
                    </div>
                    <Link 
                      to="/contact" 
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Mail size={12} /> Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LIST OF STANDARD NOTICES */}
          <div className="flex flex-col gap-2">
            {notices.map((notice) => (
              <div 
                key={notice.id} 
                className="group relative flex gap-4 p-4 rounded-[1.25rem] bg-transparent hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Subtle Glow Background on Hover */}
                <div className="absolute -inset-2 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 bg-gradient-to-br from-blue-400 to-indigo-400 pointer-events-none" />

                {/* Timeline Node */}
                <div className="flex flex-col items-center pt-1.5 relative z-10">
                  <div className={`w-2.5 h-2.5 rounded-full shadow-sm transition-all duration-300 ${
                    notice.isNew 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 ring-4 ring-blue-50 group-hover:scale-125' 
                      : 'bg-slate-300 group-hover:bg-slate-400'
                  }`} />
                  <div className="w-px h-full bg-gradient-to-b from-slate-200 to-transparent my-1.5 group-last:hidden" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-1 group-last:pb-0 relative z-10">
                  <div className="flex items-start justify-between mb-1 gap-2">
                    <h4 className="text-[13px] font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                      {notice.title}
                    </h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mt-0.5">
                      {notice.date}
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-slate-500 leading-relaxed mb-2 line-clamp-2">
                    {notice.description}
                  </p>
                  <button className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 duration-300">
                    Read more <ChevronRight size={12} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default Notice;