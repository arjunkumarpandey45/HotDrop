import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Globe,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Users,
  Bot,
  AlertTriangle
} from "lucide-react";

const About = () => {
  const { scrollYProgress } = useScroll();

  // Smoother spring for the progress line
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-700 overflow-x-hidden relative">
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 rounded-full mb-8 shadow-2xl"
          >
            <Sparkles size={14} className="text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
              HotDrop Protocol v1.0
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-[1000] tracking-tighter mb-6 leading-[0.85]">
            What is <br />
            <span className="text-orange-600">HOT</span>
            <span className="text-blue-600 ">DROP</span>
            
            <span className="text-slate-900 px-2">?</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-slate-500 font-medium text-lg">
            The ultimate ecosystem for verified, live, and breathing software projects.
          </p>
        </div>
      </section>

      {/* CENTER SCROLL LINE (Desktop Only) */}
      <div className="hidden md:block absolute left-1/2 top-[500px] bottom-0 w-[2px] -translate-x-1/2 z-0">
        <div className="absolute inset-0 bg-slate-100 opacity-50" />
        <motion.div
          style={{ scaleY }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-orange-500 via-blue-500 to-emerald-500 origin-top"
        />
      </div>

      {/* FEATURES SECTION */}
      <section className="relative py-10 px-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-16 md:gap-24">
          <FeatureRow
            side="left"
            icon={<Globe size={28} className="text-blue-600" />}
            title="Verified Live URLs"
            desc="System pings your URL before posting. If it's not live, the Drop is blocked. No broken links allowed."
            dotColor="border-blue-500"
          />

          <FeatureRow
            side="right"
            icon={<Users size={28} className="text-orange-500" />}
            title="Dev Profiles"
            desc="A clean canvas for your identity. Follow elite creators and showcase your entire live project history."
            dotColor="border-orange-500"
          />

          <FeatureRow
            side="left"
            icon={<HeartPulse size={28} className="text-emerald-500 animate-pulse" />}
            title="24/7 Pulse Detection"
            desc="Background monitoring for every link. If hosting fails, the project is auto-tagged as DEAD on the feed."
            dotColor="border-emerald-500"
          />

          <FeatureRow
            side="right"
            icon={<Bot size={28} className="text-blue-600 animate-bounce" />}
            title="Neural AI Assistant"
            desc="Smart A.I that helps you optimize your Drop for maximum impact. "
            dotColor="border-blue-400"
          />

          <FeatureRow
            side="left"
            icon={<AlertTriangle size={28} className="text-red-600" />}
            title="Zero-Broke Ecosystem"
            desc="We ensure every 'Drop' is a functional masterpiece. By filtering broken links, we let you showcase expertise with absolute authority."
            dotColor="border-red-500"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-slate-100 flex flex-col items-center justify-center bg-white z-10 relative">
        <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
          <ShieldCheck size={20} className="text-orange-500" />
          <span className="text-[12px] font-black tracking-[0.5em] text-slate-900">HOTDROP CORE ENGINE</span>
        </div>
      </footer>
    </div>
  );
};

/* HELPER COMPONENTS */

const FeatureRow = ({ side, icon, title, desc, dotColor }) => {
  const isLeft = side === "left";
  
  return (
    <div className="flex flex-col md:flex-row items-center w-full relative group">
      {/* Left side container */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end px-4 md:px-12 order-2 md:order-1">
        {isLeft && <Card icon={icon} title={title} desc={desc} align="right" />}
      </div>

      {/* Center Dot */}
      <div className={`hidden md:block relative z-20 w-5 h-5 rounded-full bg-white border-[5px] ${dotColor} shadow-xl transition-transform duration-300 group-hover:scale-125 order-2`} />

      {/* Right side container */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-start px-4 md:px-12 order-3">
        {!isLeft && <Card icon={icon} title={title} desc={desc} align="left" />}
      </div>
    </div>
  );
};

const Card = ({ icon, title, desc, align }) => (
  <motion.div 
    whileInView={{ opacity: 1, x: 0 }}
    initial={{ opacity: 0, x: align === "right" ? -20 : 20 }}
    viewport={{ once: true }}
    className={`w-full max-w-[420px] p-8 rounded-[2.5rem] border transition-all duration-500 bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 
    ${align === "right" ? "md:text-right" : "md:text-left"} text-left`}
  >
    <div className={`mb-4 flex ${align === "right" ? "md:justify-end" : "justify-start"}`}>
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
    </div>
    <h3 className="font-black text-xl mb-3 tracking-tight text-slate-900">{title}</h3>
    <p className="text-sm leading-relaxed font-medium text-slate-500">{desc}</p>
  </motion.div>
);

export default About;