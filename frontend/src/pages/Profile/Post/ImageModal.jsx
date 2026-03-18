import { X, ChevronLeft, ChevronRight, Globe, ExternalLink, Heart, MessageCircle, Share2 } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { formatDistanceToNow } from "date-fns";
import dp from "../../../assets/dp.jpg";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import PreviewModal from "./PreviewModal";
import { Link } from "react-router";
function ImageModal({ post, modalIndex, setModalIndex, handleLike, onClose, setLikePost, setCommentPost, setSharePost, ownerOverride }) {
  const { user: currentUser } = useAuthStore();
const [previewUrl, setPreviewUrl] = useState(null);
const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 50
  const postOwner = post?.user?.hotdropId ? post.user : (ownerOverride || currentUser);

  // 2. LIVE DATA SYNC
  const livePost = post;
  const isLiked = livePost.likes?.some(l => (l._id || l) === currentUser?._id);
const toggleExpand = (e) => {
  e.preventDefault();
  setIsExpanded(!isExpanded);
};
  const next = (e) => {
    e.stopPropagation();
    setModalIndex((prev) => (prev + 1) % livePost.images.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setModalIndex((prev) => (prev - 1 + livePost.images.length) % livePost.images.length);
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-[99] p-3"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-5 right-5 text-white/70 hover:text-white transition-transform hover:scale-110 z-[1100]"
      >
        <X  className="text-red-500 cursor- pointer" size={26} />
      </button>

      <div 
        className="bg-white w-full max-w-[1000px] h-[90vh] md:h-[80vh] flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl border relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGE AREA */}
        <div className="md:w-[65%] w-full bg-black flex items-center justify-center relative group">
          <img
            src={livePost.images?.[modalIndex]?.url}
            className="object-contain w-full h-full p-2"
            alt="Preview"
          />

          {livePost.images.length > 1 && (
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between z-10">
              <button onClick={prev} className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/40"><ChevronLeft size={20} /></button>
              <button onClick={next} className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/40"><ChevronRight size={20} /></button>
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 px-2 py-1 rounded text-[10px] text-white">
            {modalIndex + 1} / {livePost.images.length}
          </div>
        </div>

        {/* DETAILS PANEL */}
        <div className="md:w-[35%] w-full flex flex-col bg-white overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* postOwner dynamic hai - Profile aur Feed dono handle karega */}
              <img
                src={postOwner?.profilePicture || dp}
                className="w-9 h-9 rounded-full object-cover"
                alt="avatar"
              />
              <div className="flex flex-col">
               <Link to={`/user/userprofile/${postOwner?.hotdropId}`} className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors">
                 <span className="text-[12px] font-bold lowercase tracking-tight text-black bg-clip-text ">
                  @{postOwner?.hotdropId || "user"}
                </span>
               </Link>
                <div className="flex items-center text-[9px] font-bold text-slate-400">
                  {post.createdAt ? (
                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                  ) : (
                    <span>just now</span>
                  )}
                </div>
              </div>
            </div>
            <div className="font-black text-sm tracking-wide">
              <span className="text-orange-500">HOT</span>
              <span className="text-blue-600">DROP</span>
            </div>
          </div>

          <div className="p-5 space-y-5 flex-1 overflow-y-auto">
            <div>
              <h2 className="font-semibold text-lg text-slate-900 mb-2 leading-tight">{livePost.title}</h2>
              <div className="flex flex-wrap gap-1">
                {livePost.tags?.map((tag, i) => (
                  <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wider">#{tag}</span>
                ))}
              </div>
            </div>

             <p className="text-[12px] text-slate-900 pb-3  font-medium leading-relaxed">
     
      {isExpanded ? post.description : `${post.description.slice(0, maxLength)}`}
      
      {/* Button ko text ke bilkul saath ya niche dikhane ke liye condition */}
      {post.description.length > maxLength && (
        <button 
          onClick={toggleExpand}
          className="ml-1 text-[11px] text-slate-400 hover:text-blue-600 font-bold transition-colors cursor-pointer inline-block"
        >
          {isExpanded ? '  ..Show Less' : '  ...Read More'}
        </button>
      )}
    </p>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Link</span>
              <div onClick={(e) => {
                  e.preventDefault();
                 
                  if (!post.isLinkDead) {
                    setPreviewUrl(post.projectLink);
                  } else {
                    toast.error("This project link appears to be dead")
                  }
                }}className="group/link relative flex items-center cursor-pointer justify-between p-[1px] rounded-xl transition-all duration-300 hover:scale-[1.01]">
                <div className={`absolute inset-0 rounded-xl opacity-10 group-hover/link:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${livePost.isLinkDead ? 'from-red-500 to-orange-500' : 'from-blue-500 via-cyan-400 to-emerald-400'}`} />
                <div className="relative w-full flex items-center justify-between bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-[11px] px-3 py-1.5 shadow-sm">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-500 ${livePost.isLinkDead ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600 group-hover/link:bg-blue-600 group-hover/link:text-white'}`}><Globe size={13} strokeWidth={2.5} /></div>
                    <span className="text-[10px] font-bold text-slate-700 truncate">{livePost.projectLink?.replace("https://", "").replace("www.", "")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${livePost.isLinkDead ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600 group-hover/link:bg-emerald-500 group-hover/link:text-white"}`}>
                      <span className={`w-1 h-1 rounded-full ${livePost.isLinkDead ? "bg-red-500" : "bg-emerald-500 group-hover/link:bg-white"} animate-pulse`} />
                      {livePost.isLinkDead ? "Dead" : "Live"}
                    </div>
                    <ExternalLink size={11} className="text-slate-300 group-hover/link:text-blue-500 transition-all" />
                  </div>
                </div>
            </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="hidden md:flex justify-between items-center p-5 border-t bg-slate-50/50 mt-auto">
            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-1.5 group/stat">
                <Heart 
                  size={20} 
                  onClick={(e) => { e.stopPropagation(); handleLike(livePost); }}
                  className={`cursor-pointer transition-all duration-300 hover:scale-110 ${isLiked ? "fill-red-500 text-red-500" : "text-slate-400 group-hover/stat:text-red-500"}`} 
                />
                <span onClick={(e) => { e.stopPropagation(); setLikePost(livePost); }} className="text-xs font-black text-slate-700 cursor-pointer hover:text-blue-600 px-1 py-1">
                  {livePost.likes?.length || 0}
                </span>
              </div>
              <div className="flex items-center gap-1.5 group/stat">
                <MessageCircle onClick={(e) => { e.stopPropagation(); setCommentPost(livePost); }} size={20} className="text-slate-400 group-hover/stat:text-blue-500 transition-colors cursor-pointer" />
                <span className="text-xs font-black text-slate-700 cursor-pointer hover:text-blue-600 px-1 py-1">{livePost.comments?.length || 0}</span>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setSharePost(livePost); }} className="p-2 hover:bg-white rounded-full transition-all shadow-sm group/share">
              <Share2 size={18} className="text-slate-400 group-hover/share:text-emerald-500" />
            </button>
          </div>
          <AnimatePresence>{previewUrl && (
        <PreviewModal key={previewUrl} url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}</AnimatePresence>
        </div>
      </div>
    </div>
    
  );
  
}

export default ImageModal;