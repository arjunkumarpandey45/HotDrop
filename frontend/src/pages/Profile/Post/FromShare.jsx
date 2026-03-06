import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import {
  Heart,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Globe,
  ExternalLink,
  ArrowLeft,
  Clock,
  Lock,
  X,
  ShieldCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import CommentModal from "../Post/CommentModal";
import LikeModal from "../Post/LikeModal";
import ShareModal from "./ShareModal";
import API from "../../../api/Api";
import { toast, ToastContainer } from "react-toastify";

function FromShare() {
  const { postId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentPost, setCommentPost] = useState(null);
  const [likePost, setLikePost] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [sharePost, setSharePost] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/post/getpost/${postId}`);
        setPost(res.data.data);
      } catch (error) {
        toast.error("Drop not found!");
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchSinglePost();
  }, [postId]);

  const handleLike = async (postToLike) => {
    if (!user) return setShowAuthModal(true);
    try {
      const res = await API.post(`/post/like/${postToLike._id}`);
      if (res.status === 200) {
        const { isLiked } = res.data.data;
        const currentUserObj = { _id: user._id, hotdropId: user.hotdropId, profilePicture: user.profilePicture };
        setPost((prev) => ({
          ...prev,
          likes: isLiked ? [currentUserObj, ...(prev.likes || [])] : (prev.likes || []).filter((l) => (l._id || l) !== user._id),
        }));
      }
    } catch (error) { toast.error("Action failed"); }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) return setShowAuthModal(true);
    if (!commentText.trim()) return;
    try {
      const res = await API.post(`/post/comment/${post._id}`, { text: commentText });
      const newComment = res.data.data;
      setPost((prev) => ({ 
        ...prev, 
        comments: [newComment, ...(prev.comments || [])],
        commentCount: (prev.commentCount || 0) + 1
      }));
      setCommentText("");
      toast.success("Comment added!");
    } catch (error) { toast.error("Error adding comment"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-400 animate-pulse tracking-[0.3em]">HOTDROP...</div>;
  if (!post) return <div className="h-screen flex items-center justify-center font-black text-slate-800 uppercase">404 Drop Not Found</div>;

  const images = post.images || [];
  const owner = post.user || {};

  return (
    <div className="min-h-screen bg-[#fcfcfd] py-10 px-4">
      <ToastContainer position="top-center" autoClose={2000} theme="light" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="hidden lg:block">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-all">
              <ArrowLeft size={16} /> Back
           </button>
        </div>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/user/userprofile/${owner.hotdropId}`)}>
                <img src={owner.profilePicture} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-50 transition-all" alt="u" />
                <div className="flex flex-col">
                  <span className="text-[12px] font-black lowercase text-indigo-600 leading-none">@{owner.hotdropId}</span>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase mt-1">
                    <Clock size={10} /> {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "just now"}
                  </div>
                </div>
              </div>
              <Share2 size={18} className="text-slate-400 cursor-pointer hover:text-indigo-400" onClick={() => setSharePost(post)} />
            </div>

            {/* Image Box */}
            <div className="relative mx-3 bg-slate-950 rounded-[1rem] aspect-[16/9] flex items-center justify-center overflow-hidden border border-slate-900 group cursor-pointer" onClick={() => !user && setShowAuthModal(true)}>
              <img src={images[currentImage]?.url} className={`w-full h-full object-contain transition-all duration-700 group-hover:scale-105 ${!user ? 'blur-sm opacity-50' : ''}`} alt="post" />
              {!user && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-white/90 px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase shadow-xl">
                    <Lock size={12} className="text-indigo-600" /> Private Content
                  </div>
                </div>
              )}
              {user && images.length > 1 && (
                <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={(e) => { e.stopPropagation(); setCurrentImage((p) => (p - 1 + images.length) % images.length)}} className="bg-white/10 p-2 rounded-2xl text-white"><ChevronLeft size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setCurrentImage((p) => (p + 1) % images.length)}} className="bg-white/10 p-2 rounded-2xl text-white"><ChevronRight size={18} /></button>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col">
              <h3 className="text-[14px] font-black uppercase text-slate-800 mb-4 tracking-tight">{post.title}</h3>

              {/* STYLED & PROTECTED PROJECT LINK */}
              <div 
                className="group/link relative flex items-center justify-between p-[1px] rounded-xl mb-4 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                onClick={() => !user ? setShowAuthModal(true) : window.open(post.projectLink, "_blank")}
              >
                {/* Border Glow Layer */}
                <div className={`absolute inset-0 rounded-xl opacity-10 group-hover/link:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${post.isLinkDead ? "from-red-500 to-orange-500" : "from-blue-500 via-cyan-400 to-emerald-400"}`} /> 

                {/* Main Compact Body */}
                <div className="relative w-full flex items-center justify-between bg-white border border-slate-200/50 rounded-[11px] px-3 py-1.5 shadow-sm">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-500 ${post.isLinkDead ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600 group-hover/link:bg-blue-600 group-hover/link:text-white"}`}>
                      <Globe size={13} strokeWidth={2.5} />
                    </div>

                    <div className={`flex flex-col truncate transition-all duration-700 ${!user ? "blur-[4px] select-none" : ""}`}>
                      <span className="text-[10px] font-bold text-slate-700 truncate tracking-tight group-hover/link:text-blue-700 transition-colors">
                        {user ? post.projectLink?.replace("https://", "").replace("www.", "") : "hidden-project-url-protected"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!user ? (
                      <div className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                        <Lock size={10} /><span className="text-[9px] font-black uppercase">Unlock</span>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${post.isLinkDead ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600 group-hover/link:bg-emerald-500 group-hover/link:text-white"}`}>
                        <span className={`w-1 h-1 rounded-full ${post.isLinkDead ? "bg-red-500" : "bg-emerald-500 group-hover/link:bg-white"} animate-pulse`} />
                        {post.isLinkDead ? "Dead" : "Live"}
                      </div>
                    )}
                    <ExternalLink size={11} className="text-slate-300 group-hover/link:text-blue-500 transition-all" />
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-slate-600 leading-relaxed mb-6 italic">"{post.description}"</p>
              
              <div className="flex gap-8 border-t pt-5">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleLike(post)}>
                  <Heart size={22} className={`${post.likes?.some(l => (l._id || l) === user?._id) ? "fill-red-500 text-red-500 scale-125" : "text-slate-300 group-hover:text-red-400"} transition-all`} />
                  <span className="text-xs font-black text-slate-800 hover:text-indigo-600">{post.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => !user ? setShowAuthModal(true) : setCommentPost(post)}>
                  <MessageCircle size={22} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-xs font-black text-slate-800">{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block"></div>
      </div>

      {/* COMPACT AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
          <div className="relative bg-white w-full max-w-[300px] rounded-2xl p-6 shadow-xl text-center border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4"><ShieldCheck size={24} /></div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Sign in required</h2>
            <p className="text-[12px] text-slate-500 mb-6">Please login to access links and comments.</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/login")} className="w-full bg-indigo-600 text-white text-[13px] font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-all">Sign In</button>
              <button onClick={() => setShowAuthModal(false)} className="w-full bg-slate-50 text-slate-600 text-[13px] font-semibold py-2.5 rounded-lg hover:bg-slate-100">Cancel</button>
            </div>
            <p className="mt-4 text-[11px] text-slate-400">New here? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create account</Link></p>
          </div>
        </div>
      )}

      {/* MODALS */}
      {commentPost && <CommentModal post={post} commentText={commentText} setCommentText={setCommentText} submitComment={submitComment} onClose={() => setCommentPost(null)} setCommentPost={(upd) => setPost(upd)} />}
      {sharePost && <ShareModal post={post} onClose={() => setSharePost(null)} />}
      {likePost && <LikeModal post={post} onClose={() => setLikePost(null)} />}
    </div>
  );
}

export default FromShare;