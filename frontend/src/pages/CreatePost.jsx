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
  Globe, // Naya icon click to verify ke liye
} from "lucide-react";
import PostPreview from "./PostPreview";
import API from "../api/Api";
import { useAuthStore } from "../store/useAuthStore";
import { showPostErrorToast, showPostSuccessToast } from "../Toast/toast";

const CreatePost = ({ isOpen, onClose }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingLink, setVerifyingLink] = useState(false);
  const [isLinkVerified, setIsLinkVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectLink: "",
    isLinkDead: true,
    tags: "",
    images: [],
  });

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  
  const checkUrl = async (url) => {
    if (!url) return;
    setVerifyingLink(true);
    try {
      const res = await API.post("/post/verifylink", { url }, { withCredentials: true });

      if (res.data.success) {
        setFormData(prev => ({ ...prev, isLinkDead: false, projectLink: url }));
        setIsLinkVerified(true);
      } else {
        setFormData(prev => ({ ...prev, isLinkDead: true }));
        setIsLinkVerified(false);
      }
    } catch (error) {
      setFormData(prev => ({ ...prev, isLinkDead: true }));
      setIsLinkVerified(false);
      showPostErrorToast("Link is Dead or Unreachable.");
    } finally {
      setVerifyingLink(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 3) {
      alert("Maximum 3 images allowed!");
      return;
    }
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeImage = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated });
  };

  // Fixed isFormValid Logic
  const isFormValid =
    formData.title.trim() !== "" &&
    formData.description.trim() !== "" &&
    isLinkVerified &&
    !formData.isLinkDead &&
    !verifyingLink;

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("projectLink", formData.projectLink);
      data.append("tags", formData.tags);
      formData.images.forEach((file) => data.append("images", file));

      const response = await API.post("/post/createpost", data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 0,
        withCredentials: true,
      });

      if (response.status === 201) {
        useAuthStore.getState().updatePostCountLocally();
        showPostSuccessToast(formData.title);
        onClose();
      }
    } catch (error) {
      showPostErrorToast(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 text-white flex justify-between items-center">
          <h2 className="text-sm font-black uppercase tracking-wide">Drop Your Project</h2>
          <button onClick={onClose} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
          {/* Title */}
          <div className="relative">
            <Type className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Project Name"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="relative">
            <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <textarea
              placeholder="Short description..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 h-20 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* URL + Verify Button */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="https://project.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                onChange={(e) => {
                  setFormData({ ...formData, projectLink: e.target.value });
                  setIsLinkVerified(false);
                }}
              />
            </div>

            <button
              type="button"
              disabled={verifyingLink || !formData.projectLink}
              onClick={() => checkUrl(formData.projectLink)}
              className={`px-3 rounded-lg border flex items-center gap-1.5 text-[9px] font-bold transition min-w-[100px] justify-center ${
                verifyingLink
                  ? "bg-slate-100 text-slate-400"
                  : isLinkVerified
                    ? formData.isLinkDead
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              }`}
            >
              {verifyingLink ? (
                <span className="animate-pulse italic">Checking...</span>
              ) : isLinkVerified ? (
                <>
                  {formData.isLinkDead ? <XCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                  {formData.isLinkDead ? "DEAD" : "LIVE"}
                </>
              ) : (
                <>
                  <Globe className="h-3 w-3" />
                  CLICK TO VERIFY
                </>
              )}
            </button>
          </div>

          {/* Tags */}
          <div className="relative">
            <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="React, Tailwind..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          {/* Images */}
          <div className="flex gap-2 flex-wrap">
            {formData.images.map((img, i) => (
              <div key={i} className="relative w-16 h-14 rounded-md overflow-hidden border">
                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="preview" />
                <button onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {formData.images.length < 3 && (
              <label className="w-16 h-14 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-slate-50 transition">
                <input type="file" multiple onChange={handleImageChange} className="hidden" />
                <ImagePlus className="h-4 w-4 text-slate-400" />
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-50 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border text-xs font-bold text-slate-600 hover:bg-slate-100 transition">
            Cancel
          </button>
          <button
            disabled={!isFormValid}
            onClick={() => setShowPreview(true)}
            className={`flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1 transition ${
              isFormValid
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Preview <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <PostPreview isOpen={showPreview} data={formData} onClose={() => setShowPreview(false)} onConfirm={handleFinalSubmit} loading={loading} />
    </div>
  );
};

export default CreatePost;