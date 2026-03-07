import React from "react";
import { ExternalLink, Sparkles, Rocket, Bot, Zap, Cpu, Globe, ShoppingCart } from "lucide-react";

function Sponser() {
  const sponsors = [
  
    { 
      id: 2, 
      name: "OpenAI", 
      title: "Pioneer of GenAI",
      desc: "Empowering developers with GPT-4o and cutting-edge NLP models for the next era.",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg", 
      link: "https://openai.com", 
      theme: "text-emerald-500",
      icon: <Bot size={22} />,
      glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
    },
    { 
      id: 3, 
      name: "NVIDIA", 
      title: "The AI Engine",
      desc: "The backbone of AI revolution powered by H100 GPUs and CUDA technology.",
      image: "https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg", 
      link: "https://nvidia.com", 
      theme: "text-green-600",
      icon: <Cpu size={22} />,
      glow: "group-hover:shadow-[0_0_20px_rgba(22,163,74,0.2)]"
    },
    { 
      id: 4, 
      name: "Meta AI", 
      title: "Open Llama 3",
      desc: "The leading open-source models for every developer building the future.",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", 
      link: "https://ai.meta.com", 
      theme: "text-blue-700",
      icon: <Globe size={22} />,
      glow: "group-hover:shadow-[0_0_20px_rgba(29,78,216,0.2)]"
    }
  ];

  return (
    <div className="sticky top-24 w-full max-w-[310px] flex flex-col h-[calc(100vh-140px)] select-none">
      
      {/* 💎 Premium Header */}
      <div className="flex items-center justify-between mb-8 px-4 flex-shrink-0">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
            Featured
          </h3>
          <span className="text-[14px] font-black text-slate-800 tracking-tight">Sponsored Ecosystem</span>
        </div>
        <div className="p-2.5 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-2xl border border-slate-50 text-indigo-600 animate-bounce-slow">
          <Sparkles size={16} />
        </div>
      </div>

      {/* 🌊 Interactive Cards Container */}
      <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-6 pb-12">
        {sponsors.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative"
          >
            {/* Subtle Gradient Ring on Hover */}
            <div className={`absolute -inset-[1px] bg-slate-100 rounded-[2.2rem] group-hover:bg-gradient-to-br group-hover:from-slate-200 group-hover:to-slate-300 transition-all duration-500`} />
            
            <div className={`relative rounded-[2.1rem] bg-white p-5 border border-transparent transition-all duration-500 ${item.glow} group-hover:-translate-y-2 group-hover:border-slate-100`}>
              
              <div className="flex items-center gap-4 mb-4">
                {/* 🎨 Logo Box with Inner Shadow */}
                <div className="w-12 h-12 rounded-2xl bg-slate-50 shadow-inner flex items-center justify-center p-2.5 transition-all duration-500 group-hover:scale-110 group-hover:bg-white overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain filter grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className={`hidden items-center justify-center w-full h-full ${item.theme}`}>
                    {item.icon}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-center">
                     <span className={`text-[9px] font-black uppercase tracking-widest ${item.name === 'Amazon AWS' ? 'text-[#FF9900]' : 'text-slate-400'} group-hover:text-indigo-600 transition-colors`}>
                        {item.name}
                     </span>
                     <ExternalLink size={11} className="text-slate-200 group-hover:text-slate-900 transition-all translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                   </div>
                   <h4 className="text-[12px] font-black text-slate-800 mt-1 truncate tracking-tight">
                    {item.title}
                  </h4>
                </div>
              </div>

              {/* Desc: Perfectly Balanced */}
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                "{item.desc}"
              </p>

              <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${item.id === 1 ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_#FF9900]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Partner</span>
                </div>
                <div className="bg-slate-50 px-2 py-0.5 rounded text-[8px] font-black text-slate-400 uppercase group-hover:bg-slate-900 group-hover:text-white transition-all">
                  Elite Drop
                </div>
              </div>
            </div>
          </a>
        ))}

        {/* 🚀 Dark Minimalist CTA */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#020617] p-8 text-center text-white shadow-2xl group/cta">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full" />
          
          <Rocket size={24} className="text-indigo-400 mb-4 mx-auto group-hover/cta:-translate-y-1 transition-transform" />
          <h5 className="text-[14px] font-black uppercase tracking-widest mb-1 leading-none">Drop Your Tech</h5>
          <p className="text-[10px] text-slate-500 mb-6 leading-relaxed">Reach 10k+ elite developers by showcasing your URL.</p>
          
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #e2e8f0; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(-5%); } 50% { transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default Sponser;