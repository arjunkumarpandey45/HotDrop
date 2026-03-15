import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Globe,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Users,
  Bot,
  AlertTriangle,
} from "lucide-react";
import FounderCard from "./FounderCard"; // Make sure the filename matches
import arjun from "../assets/ar.jpeg";
const About = () => {
  const { scrollYProgress } = useScroll();

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-700 overflow-x-hidden relative">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-[1000] tracking-tighter mb-6 leading-[0.85]"
          >
            What is <br />
            <span className="text-orange-600">HOT</span>
            <span className="text-blue-600">DROP</span>
            <span className="text-slate-900 px-2">?</span>
          </motion.h1>

          <p className="max-w-xl mx-auto text-slate-700 font-bold text-lg">
            "GitHub stores the code, LinkedIn tells the story, but HOTDROP
            proves the execution."
          </p>
        </div>
      </section>

      {/* 2. CENTER SCROLL LINE (Desktop) */}
      <div className="hidden md:block absolute left-1/2 top-[500px] bottom-[800px] w-[2px] -translate-x-1/2 z-0">
        <div className="absolute inset-0 bg-slate-100 opacity-50" />
        <motion.div
          style={{ scaleY }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-orange-500 via-blue-500 to-emerald-500 origin-top"
        />
      </div>

      {/* 3. FEATURES SECTION */}
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
            icon={
              <HeartPulse
                size={28}
                className="text-emerald-500 animate-pulse"
              />
            }
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
        </div>
      </section>

      {/* 4. FOUNDING TEAM SECTION */}
      <section className="relative py-5 px-6 z-10 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-black tracking-tight text-slate-900"
            >
              Meet the engineers behind
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-4 flex justify-center items-center gap-2"
            >
              <span className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                HOT
              </span>

              <span className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                DROP
              </span>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 z-[9999] lg:gap-12">
            <FounderCard
              type="founder"
              name="Arjun Kumar Pandey"
              role="MERN Stack Developer "
              image={arjun}
              bio="BTech Computer Science student at BBDU. MERN stack specialist building HotDrop to show real work."
              color="orange"
              github="https://github.com/arjunkumarpandey45"
              linkedin="https://www.linkedin.com/in/arjun-kumar-pandey-b2a24a330/"
              portfolio="https://arjunkumarpandey45.vercel.app/"
            />
            <FounderCard
              type="co-founder"
              name="Ankit Mahabharat"
              role="MERN Stack Developer"
             
              bio="Focused on ecosystem scaling and ensuring every project on HotDrop meets the 'Live & Breathing' protocol standards."
              color="blue"
              github="#"
              linkedin="#"
              portfolio="#"
            />
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-10 border-t border-slate-100 flex flex-col items-center justify-center bg-white  relative">
        <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
          <ShieldCheck size={20} className="text-orange-500" />
          <span className="text-[12px] font-black tracking-[0.5em] text-slate-900 uppercase">
            HotDrop v1.0
          </span>
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
      <div className="w-full md:w-1/2 flex justify-center md:justify-end px-4 md:px-12 order-2 md:order-1">
        {isLeft && <Card icon={icon} title={title} desc={desc} align="right" />}
      </div>
      <div
        className={`hidden md:block relative z-20 w-5 h-5 rounded-full bg-white border-[5px] ${dotColor} shadow-xl transition-transform duration-300 group-hover:scale-125 order-2`}
      />
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
    <div
      className={`mb-4 flex ${align === "right" ? "md:justify-end" : "justify-start"}`}
    >
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
    </div>
    <h3 className="font-black text-xl mb-3 tracking-tight text-slate-900">
      {title}
    </h3>
    <p className="text-sm leading-relaxed font-medium text-slate-500">{desc}</p>
  </motion.div>
);

export default About;
