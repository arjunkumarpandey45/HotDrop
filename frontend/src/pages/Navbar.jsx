import React, { useState, useEffect } from "react";
import {
  Search, User, LogOut, Settings, Plus, X,
  Menu, Info, Mail, LayoutGrid, Activity, Bell
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = true;
  const hasProject = true; 
  const isProjectLive = true; 

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-300 ${scrolled ? "pt-2" : "pt-4"}`}>
      
      {/* 🌑 Overlay for Sidebar & Profile */}
      {(isProfileOpen || isSidebarOpen) && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsSidebarOpen(false);
          }}
        />
      )}

      {/* 🚀 Main Navbar Card */}
      <div className={`max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200 shadow-lg rounded-2xl px-4 py-2 flex items-center justify-between relative z-50 transition-all ${scrolled ? "shadow-blue-500/10" : ""}`}>
        
        {/* LEFT: Sidebar Toggle & Logo */}
        <div className="flex items-center gap-2 md:gap-5">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-xl transition active:scale-90"
          >
            <Menu className="h-6 w-6 text-slate-600" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition transform group-hover:rotate-6">
              <Plus className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tighter text-slate-800 hidden sm:block">
              HOTDROP
            </span>
          </Link>
        </div>

        {/* 🔍 CENTER SEARCH (Desktop Only) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* ⚡ RIGHT SECTION */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Mobile Search Icon Toggle */}
          <button 
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition"
          >
            {isMobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {/* Project Status Badge */}
          {isLoggedIn && hasProject && (
            <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-wider transition ${isProjectLive ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-red-50 text-red-600 border-red-100"}`}>
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full ${isProjectLive ? "bg-blue-400 animate-ping" : "bg-red-400"} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isProjectLive ? "bg-blue-500" : "bg-red-500"}`}></span>
              </span>
              {isProjectLive ? "LIVE" : "DEAD"}
            </div>
          )}

          {/* Create Button */}
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 sm:px-4 sm:py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-100 transition active:scale-95"
          >
            <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Drop Project</span>
          </button>

          {/* User Profile */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-9 w-9 md:h-10 md:w-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-blue-600 shadow-sm hover:border-blue-200 transition overflow-hidden"
              >
                <User className="h-5 w-5" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 mb-2 border-b border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed In</p>
                    <p className="text-sm font-bold text-slate-800 truncate">@hotdrop_user</p>
                  </div>
                  <Link to="/profile/me" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 📱 MOBILE SEARCH INPUT (Appears below Navbar) */}
      {isMobileSearchOpen && (
        <div className="md:hidden mt-2 animate-in slide-in-from-top-2 duration-300">
          <div className="relative w-full">
            <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search projects..."
              className="w-full bg-white border border-slate-200 shadow-lg rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 🚪 SIDEBAR */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white z-[60] shadow-2xl transition-transform duration-500 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-10">
            <span className="font-bold text-blue-600 text-2xl tracking-tighter">HOTDROP</span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-3">Navigation</p>
              <nav className="space-y-1">
                <Link to="/" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition font-bold text-sm"><LayoutGrid className="h-5 w-5" /> Explore</Link>
                <Link to="/about" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition font-bold text-sm"><Info className="h-5 w-5" /> About</Link>
              </nav>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-3">Support</p>
              <nav className="space-y-1">
                <Link to="/contact" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition font-bold text-sm"><Mail className="h-5 w-5" /> Contact</Link>
                <Link to="/status" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition font-bold text-sm"><Activity className="h-5 w-5" /> System Status</Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-400 font-medium">© 2026 HotDrop</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;