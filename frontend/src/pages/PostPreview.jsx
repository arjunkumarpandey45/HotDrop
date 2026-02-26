import React from "react";
import {
  X,
  Globe,
  Tag,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const PostPreview = ({ data, isOpen, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
              Preview
            </p>
            <h2 className="text-sm font-bold text-slate-800">
              Review Your Drop
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto max-h-[55vh] space-y-5">

          {/* Images */}
          <div className="grid grid-cols-3 gap-3">
            {data.images.length > 0 ? (
              data.images.slice(0, 3).map((img, i) => (
                <div
                  key={i}
                  className="aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-3 h-20 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs font-medium">
                No Screenshots
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h1 className="text-lg font-bold text-slate-900 mb-1 truncate">
              {data.title || "Untitled Project"}
            </h1>

            <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
              {data.description || "No description provided."}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {data.tags ? (
              data.tags.split(",").map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                >
                  <Tag className="h-3 w-3" />
                  {tag.trim()}
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-xs italic">
                No tags
              </span>
            )}
          </div>

          {/* Project Status */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">

            <div className="flex items-center gap-3 truncate">
              <Globe className="h-4 w-4 text-slate-500 shrink-0" />

              <div className="truncate">
                <p className="text-[9px] text-slate-400 uppercase tracking-wide">
                  URL
                </p>
                <p className="text-xs font-medium text-slate-800 truncate">
                  {data.projectLink || "hotdrop-demo.vercel.app"}
                </p>
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full ${
                data.isLinkDead
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {data.isLinkDead ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <CheckCircle2 className="h-3 w-3" />
              )}
              {data.isLinkDead ? "Dead" : "Live"}
            </div>
          </div>
        </div>

      
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition"
          >
            Back
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;