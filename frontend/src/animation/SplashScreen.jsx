import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo2.png";

const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] overflow-hidden"
    >

      {/* 🔵 Background Glow */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.15),_transparent_60%)]"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

     
     {/* ✨ Blinking White Sprinkles */}
{[...Array(30)].map((_, i) => (
  <motion.div
    key={i}
    className="absolute w-[2px] h-[2px] bg-white rounded-full"
    style={{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }}
    initial={{ opacity: 0.2 }}
    animate={{ opacity: [0.2, 1, 0.2] }}
    transition={{
      duration: 1.5 + Math.random() * 1.5,
      repeat: Infinity,
      delay: Math.random() * 2,
      ease: "easeInOut",
    }}
  />
))}

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* 🖼 Logo - Slide + Zoom */}
        <motion.img
          src={logo}
          alt="HotDrop Logo"
          fetchPriority="high" 
  initial={{ x: -20, scale: 0.95, opacity: 0.5 }} 
  animate={{ x: 0, scale: 1, opacity: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-28 sm:w-32 md:w-36 lg:w-40 mb-4 drop-shadow-[0_0_25px_rgba(59,130,246,0.7)]"
        />

        {/* HOTDROP Title */}
        <motion.h1
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-[Orbitron] text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight"
        >
          <span className="text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,1)]">
            HOT
          </span>

          <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-b from-blue-300 via-blue-500 to-blue-700 drop-shadow-[0_0_40px_rgba(59,130,246,1)]">
            DROP
          </span>
        </motion.h1>

        {/* 🔥 Quote - High Visibility */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-3 text-blue-100 font-medium uppercase tracking-[0.28em] text-[10px] sm:text-xs drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
        >
          Your ideas deserve the spotlight
        </motion.p>
      </div>

      {/* Loading Bar - 2 Seconds */}
      <div className="absolute bottom-16 flex flex-col items-center gap-2">
        <div className="w-44 sm:w-52 md:w-60 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "linear" }}
            className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]"
          />
        </div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4 }}
          className="text-[9px] text-blue-300 font-mono tracking-widest"
        >
        
        </motion.span>
      </div>

    </motion.div>
  );
};

export default SplashScreen;