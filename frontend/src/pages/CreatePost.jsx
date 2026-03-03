import React, { useState, useEffect } from "react";
import {
  X,
  Type,
  AlignLeft,
  Link as LinkIcon,
  Hash,
  ImagePlus,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import PostPreview from "./PostPreview";
import API from "../api/Api";
import { useAuthStore } from "../store/useAuthStore";
import { showPostErrorToast, showPostSuccessToast } from "../Toast/toast";
const CreatePost = ({ isOpen, onClose }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectLink: "",
    isLinkDead: false,
    tags: "",
    images: [],
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 3) {
      alert("Maximum 3 images allowed!");
      return;
    }
    setFormData({
      ...formData,
      images: [...formData.images, ...files],
    });
  };

  const removeImage = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated });
  };

  const isFormValid =
    formData.title.trim() !== "" &&
    formData.description.trim() !== "";


    const handleFinalSubmit = async () => {
      setLoading(true);
  try {
    const data = new FormData();
    
 
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("projectLink", formData.projectLink);
    data.append("tags", formData.tags);

    formData.images.forEach((file) => {
      data.append("images", file); 
    });

    const response = await API.post("/post/createpost", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 0,
      withCredentials: true, 
    });

    if (response.status === 201) {
     useAuthStore.getState().updatePostCountLocally();
      showPostSuccessToast();
      onClose(); 
    }
  } catch (error) {
    console.error("Upload error:", error);
    showPostErrorToast(error.response?.data?.message || "Something went wrong");
  }finally {
    setLoading(false); 
  }
};
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 text-white flex justify-between items-center">
          <h2 className="text-sm font-black uppercase tracking-wide">
            Drop Your Code
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">

          {/* Title */}
          <div className="relative">
            <Type className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Project Name"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="relative">
            <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <textarea
              placeholder="Short description..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 h-20 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* URL + Status */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="https://project.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectLink: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  isLinkDead: !formData.isLinkDead,
                })
              }
              className={`px-2.5 rounded-lg border flex items-center gap-1 text-[10px] font-bold transition ${
                formData.isLinkDead
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
              }`}
            >
              {formData.isLinkDead ? (
                <XCircle className="h-3 w-3" />
              ) : (
                <CheckCircle2 className="h-3 w-3" />
              )}
              {formData.isLinkDead ? "DEAD" : "LIVE"}
            </button>
          </div>

          {/* Tags */}
          <div className="relative">
            <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="React, Tailwind..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
          </div>

          {/* Images */}
          <div className="flex gap-2 flex-wrap">
            {formData.images.map((img, i) => (
              <div
                key={i}
                className="relative w-16 h-14 rounded-md overflow-hidden border"
              >
                <img
                  src={URL.createObjectURL(img)}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {formData.images.length < 3 && (
              <div className="relative w-16 h-14 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImagePlus className="h-4 w-4 text-slate-400" />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border text-xs font-bold"
          >
            Cancel
          </button>

          <button
            disabled={!isFormValid}
            onClick={() => setShowPreview(true)}
            className={`flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1 transition ${
              isFormValid
                ? "bg-blue-600 text-white"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            Preview <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <PostPreview
        isOpen={showPreview}
        data={formData}
        onClose={() => setShowPreview(false)}
        onConfirm={handleFinalSubmit}
        loading={loading}
      />
    </div>
  );
};

export default CreatePost;