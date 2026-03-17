import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  LogOut,
  Plus,
  X,
  Menu,
  Info,
  Mail,
  LayoutGrid,
  UserPlus,
  ChevronDown,
  Notebook,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CreatePost from "./CreatePost";
import logo from "../assets/logo5.png";
import { useAuthStore } from "../store/useAuthStore";
import { showSuccessToastForLogout } from "../Toast/toast";
import { Slide, ToastContainer } from "react-toastify";
import API from "../api/Api";
import dp from "../assets/dp.jpg";
const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // 🔥 NEW: State for our login prompt modal
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  
  const [scrolled, setScrolled] = useState(false);
const [suggestions, setSuggestions] = useState([]); // 🔥 New state for suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const { user, isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!showSuggestions) return;
      const desktopEl = desktopSearchRef.current;
      const mobileEl = mobileSearchRef.current;

      if (desktopEl && desktopEl.contains(e.target)) return;
      if (mobileEl && mobileEl.contains(e.target)) return;

      setShowSuggestions(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSuggestions]);

  const handleSuggestionClick = (hotdropId) => {
    if (!isLoggedIn) {
      setIsLoginPromptOpen(true);
      setIsMobileSearchOpen(false);
      return;
    }
  
    navigate(`/user/userprofile/${hotdropId}`);
    
 
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setIsMobileSearchOpen(false);
  };
  const handleCreateClick = () => {
    if (!isLoggedIn) {
      navigate("/signup");
    } else {
      setIsCreateModalOpen(true);
    }
  };
useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 1) {
        setSuggestions([]);
        return;
      }
      try {
        
        const { data } = await API.get(`/user/search?q=${searchQuery}`);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search error", err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // 300ms Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  // 🔥 UPDATED: Search handler now checks for login status
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      if (!isLoggedIn) {
        // If not logged in, stop the search and show the prompt
        setIsLoginPromptOpen(true);
        setIsMobileSearchOpen(false); // Close mobile search bar if open
        return;
      }
      
      // If logged in, proceed normally
      navigate(`/user/userprofile/${searchQuery}`);
     setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      showSuccessToastForLogout();
      setIsProfileOpen(false);
      navigate("/");
    } catch {
      
      console.error("Logout failed");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-300 ${
        scrolled ? "pt-2" : "pt-4"
      }`}
    >
     
      {(isProfileOpen || isSidebarOpen || isCreateModalOpen || isLoginPromptOpen) && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsSidebarOpen(false);
            setIsCreateModalOpen(false);
            setIsLoginPromptOpen(false); 
          }}
        />
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeButton={false}
        theme="light"
        transition={Slide}
      />

      {showSuggestions && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}

      {/* NAVBAR CARD */}
      <div
        className={`max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200 shadow-lg rounded-2xl px-4 py-2 flex items-center justify-between relative z-50`}
      >
        {/* MOBILE SEARCH MODE */}
        {isMobileSearchOpen ? (
          <div className="flex items-center w-full gap-3 md:hidden">
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-100"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>

            <div className="relative flex-1" ref={mobileSearchRef}>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search HotDrop ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute cursor-pointer top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                   {suggestions.map(s => (
                     <div key={s._id} onClick={() => handleSuggestionClick(s.hotdropId)} className="p-3 cursor-pointer hover:bg-slate-50 flex items-center gap-3 cursor-pointer">
                        <img src={s.profilePicture || dp} className="h-8 w-8 rounded-full" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">@{s.hotdropId}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{s.username}</span>
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* LEFT */}
            <div className="flex items-center gap-2 md:gap-5">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-xl transition"
              >
                <Menu className="h-6 w-6 text-slate-600" />
              </button>

              <Link to="/" className="flex items-center gap-2">
                <img src={logo} width="100" alt="Logo" />
              </Link>
            </div>

            {/* DESKTOP SEARCH */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full" ref={desktopSearchRef}>
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search HotDrop ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full  left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggestions</p>
                    {suggestions.map((s) => (
                      <button
                        key={s._id}
                        onClick={() => handleSuggestionClick(s.hotdropId)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition text-left"
                      >
                        <div className="h-8 w-8 cursor-pointer rounded-full bg-blue-100 flex-shrink-0 overflow-hidden border border-slate-200">
                          <img src={s.profilePicture || dp} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex cursor-pointer flex-col">
                          <span className="text-sm  font-bold text-slate-900">@{s.hotdropId}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{s.username}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="md:hidden p-2 hover:bg-slate-100 rounded-xl"
              >
                <Search className="h-5 w-5 text-slate-600" />
              </button>

              <button
                onClick={handleCreateClick}
                className="group relative flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-md sm:shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-blue-600/40 active:scale-95 overflow-hidden"
              >
                <span className="absolute left-[-75%] top-0 h-full w-1/2 bg-white/20 skew-x-12 group-hover:left-[130%] transition-all duration-700"></span>
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 relative z-10" />
                <span className="relative z-10 hidden sm:inline tracking-wide">
                  Drop Project
                </span>
              </button>

              {!isLoggedIn ? (
                <Link
                  to="/signup"
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Join Now</span>
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-1 p-1 rounded-full border border-slate-200 hover:border-blue-400 transition bg-white"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          className="w-full h-full object-cover"
                          alt="Profile"
                        />
                      ) : (
                        user?.username?.charAt(0) || "U"
                      )}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          @{user?.hotdropId || "dev"}
                        </p>
                      </div>

                      <Link
                        to="/profile/me"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 transition"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>

                      <div className="h-px bg-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[60] shadow-2xl transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center tracking-tighter">
              <span className="font-black text-2xl text-orange-500 uppercase">
                Hot
              </span>
              <span className="font-black text-2xl text-blue-600 px-1 uppercase">
                Drop
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-xl transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="space-y-1 flex-1">
            <Link
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm ${
                isActive("/") ? "bg-blue-50 text-blue-600" : "text-slate-600"
              }`}
            >
              <LayoutGrid className="h-5 w-5" /> Explore Feed
            </Link>

            <Link
              to="/about"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm ${
                isActive("/about")
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600"
              }`}
            >
              <Info className="h-5 w-5" /> About
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl text-slate-600 font-bold text-sm"
            >
              <Mail className="h-5 w-5" /> Contact us
            </Link>
            <Link
              to="/notice"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl text-slate-600 font-bold text-sm"
            >
              <Notebook className="h-5 w-5" /> Notice
            </Link>
          </nav>
        </div>
      </div>

      {/* 🔥 NEW: LOGIN PROMPT MODAL */}
      {isLoginPromptOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[70] px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsLoginPromptOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <UserPlus className="h-7 w-7 text-blue-600" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sign in to search</h3>
            <p className="text-sm text-slate-500 mb-6">
              You need to be logged in to search for other HotDrop creators and view their profiles.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsLoginPromptOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLoginPromptOpen(false);
                  navigate("/signup"); // Redirects to your signup/login page
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      )}

      <CreatePost
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Navbar;