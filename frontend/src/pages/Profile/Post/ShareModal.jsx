
import React, { useEffect, useState } from "react";
import { X, Copy, Linkedin, Send, Check } from "lucide-react";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";
function ShareModal({ post, onClose }) {

  const postUrl = `${window.location.origin}/getpost/${post._id}`;
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[500] bg-black/40 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >

      <div
        className="relative bg-white rounded-2xl w-[360px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-100 p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HOTDROP BRAND */}
        <div className="absolute top-3 left-4 text-[10px] font-black tracking-[0.25em]">
          <span className="text-orange-500">HOT</span>
          <span className="text-blue-600">DROP</span>
        </div>


        {/* HEADER */}
        <div className="flex justify-between items-center mb-5 pt-3">

          <h2 className="font-bold text-slate-800 text-lg tracking-tight">
            Share Drop
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>

        </div>


        {/* GRADIENT DIVIDER */}
        <div className="h-[2px] w-full bg-gradient-to-r from-orange-400 via-blue-400 to-emerald-400 mb-5 rounded-full"/>


        {/* LINK PREVIEW */}
        <div className="border border-slate-200 rounded-lg p-3 text-xs text-slate-600 mb-5 truncate bg-slate-50">
          {postUrl}
        </div>


        {/* ACTIONS */}
        <div className="flex flex-col gap-3">

          {/* COPY */}
          <button
            onClick={copyLink}
            className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-2.5 hover:bg-slate-50 transition group"
          >
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">

              <div className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 group-hover:bg-slate-200 transition">
                {copied ? (
                  <Check size={15} className="text-emerald-500"/>
                ) : (
                  <Copy size={15}/>
                )}
              </div>

              {copied ? "Copied!" : "Copy Link"}

            </div>
          </button>


          {/* WHATSAPP */}
          <a
            href={`https://wa.me/?text=${postUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-2.5 hover:bg-green-50 hover:border-green-200 transition"
          >
            <div className="w-7 h-7 flex items-center justify-center rounded-md bg-green-100">
              <FaWhatsapp size={15} className="text-green-600"/>
            </div>

            <span className="text-sm font-semibold text-slate-700">
              Share on WhatsApp
            </span>
          </a>


          {/* TWITTER */}
          <a
            href={`https://twitter.com/intent/tweet?url=${postUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-2.5 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            <div className="w-7 h-7 flex items-center justify-center rounded-md bg-sky-100">
              <FaXTwitter size={15} className="text-sky-600"/>
            </div>

            <span className="text-sm font-semibold text-slate-700">
              Share on X / Twitter
            </span>
          </a>


          {/* LINKEDIN */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-2.5 hover:bg-blue-50 hover:border-blue-200 transition"
          >
            <div className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-100">
              <Linkedin size={15} className="text-blue-600"/>
            </div>

            <span className="text-sm font-semibold text-slate-700">
              Share on LinkedIn
            </span>
          </a>

        </div>

      </div>

    </div>
  );
}

export default ShareModal;

