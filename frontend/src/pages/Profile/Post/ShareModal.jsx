import React, { useEffect } from "react";
import { X, Copy, Linkedin, Send } from "lucide-react";

function ShareModal({ post, onClose }) {

  const postUrl = `${window.location.origin}/post/${post._id}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(postUrl);
    alert("Link copied!");
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
      className="fixed inset-0 z-500 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-[360px] shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Share Post</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* LINK PREVIEW */}
        <div className="border rounded-lg p-3 text-sm text-slate-600 mb-4 truncate">
          {postUrl}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">

          <button
            onClick={copyLink}
            className="flex items-center gap-3 border rounded-lg px-4 py-2 hover:bg-slate-50"
          >
            <Copy size={16} />
            Copy Link
          </button>

          <a
            href={`https://wa.me/?text=${postUrl}`}
            target="_blank"
            className="flex items-center gap-3 border rounded-lg px-4 py-2 hover:bg-slate-50"
          >
            <Send size={16} />
            WhatsApp
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${postUrl}`}
            target="_blank"
            className="flex items-center gap-3 border rounded-lg px-4 py-2 hover:bg-slate-50"
          >
            <Send size={16} />
            Twitter / X
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`}
            target="_blank"
            className="flex items-center gap-3 border rounded-lg px-4 py-2 hover:bg-slate-50"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>

        </div>
      </div>
    </div>
  );
}

export default ShareModal;