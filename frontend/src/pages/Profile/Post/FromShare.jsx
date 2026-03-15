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
  ShieldCheck,
  X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import CommentModal from "../Post/CommentModal";
import LikeModal from "../Post/LikeModal";
import ShareModal from "./ShareModal";
import ImageModal from "../Post/ImageModal";
import API from "../../../api/Api";
import { toast, ToastContainer } from "react-toastify";
import dp from "../../../assets/dp.jpg";
import { AnimatePresence } from "framer-motion";
import PreviewModal from "./PreviewModal";
function FromShare() {
  const { postId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
const [previewUrl, setPreviewUrl] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentPost, setCommentPost] = useState(null);
  const [likePost, setLikePost] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [sharePost, setSharePost] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [imagePost, setImagePost] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);

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
        const currentUserObj = {
          _id: user._id,
          hotdropId: user.hotdropId,
          profilePicture: user.profilePicture,
        };

        setPost((prev) => ({
          ...prev,
          likes: isLiked
            ? [currentUserObj, ...(prev.likes || [])]
            : (prev.likes || []).filter((l) => (l._id || l) !== user._id),
        }));

        useAuthStore.setState((state) => ({
          user: state.user ? {
            ...state.user,
            posts: state.user.posts?.map((p) =>
              p._id === postToLike._id
                ? { 
                    ...p, 
                    likes: isLiked 
                      ? [currentUserObj, ...(p.likes || [])] 
                      : (p.likes || []).filter(l => (l._id || l) !== user._id)
                  }
                : p
            )
          } : null
        }));
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) return setShowAuthModal(true);
    if (!commentText.trim()) return;

    try {
      const res = await API.post(`/post/comment/${post._id}`, {
        text: commentText,
      });
      const newComment = res.data.data;

      setPost((prev) => ({
        ...prev,
        comments: [newComment, ...(prev.comments || [])],
        commentCount: (prev.commentCount || 0) + 1
      }));

      useAuthStore.setState((state) => ({
        user: state.user ? {
          ...state.user,
          posts: state.user.posts?.map((p) =>
            p._id === post._id
              ? { ...p, comments: [newComment, ...(p.comments || [])] }
              : p
          )
        } : null
      }));

      setCommentText("");
    } catch (error) {
      toast.error("Error adding comment");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-400 tracking-widest uppercase animate-pulse">Loading...</div>;
  if (!post) return <div className="h-screen flex items-center justify-center font-black text-slate-800">404 NOT FOUND</div>;

  const images = post.images || [];
  const owner = post.user || {};

  return (
    <div className="min-h-screen bg-[#fcfcfd] py-10 px-4">
      {/* Top Bar with HotDrop branding (desktop only) */}
      <div className="hidden lg:block fixed top-0 right-0 z-50 py-9 p-4">
        <span className="font-black text-xl text-orange-500 uppercase">Hot</span>
        <span className="font-black text-xl text-blue-600  uppercase">Drop</span>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="light"
        toastClassName={() => 
          "relative flex p-5 min-h-10 rounded-2xl justify-between overflow-hidden cursor-pointer bg-white text-slate-800 shadow-2xl border border-slate-100 mb-2 font-bold text-[12px] uppercase tracking-wider"
        }
      />

      <div className="max-w-4xl mx-auto grid grid-cols-1  lg:grid-cols-4 ">
        {/* Left Side Desktop */}
        <div className="hidden lg:block">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-all">
              <ArrowLeft size={16} /> Back
           </button>
        </div>

        {/* Main Content Column */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          <div className="lg:hidden flex justify-between items-center mb-4">
            <button onClick={() => navigate(-1)} className="px-2 bg-white rounded-full shadow-sm text-slate-400">
               <ArrowLeft size={18} />
            </button>
            <div className="text-[14px] font-black tracking-[0.2em] uppercase ">
              <span className="text-orange-500">Hot</span><span className="text-blue-600">Drop</span>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem]  px-2 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden flex flex-col">
            {/* PROFILE */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-50/50">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/user/userprofile/${owner.hotdropId}`)}>
                <img src={owner.profilePicture||dp} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-50" alt="avatar" />
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-slate-800">@{owner.hotdropId}</span>
                  <div className="flex items-center text-[9px] font-bold text-slate-400">
                    <Clock size={10} className="mr-1" />
                    {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "just now"}
                  </div>
                </div>
              </div>
              <Share2 size={18} className="text-slate-400 cursor-pointer hover:text-indigo-400" onClick={() => setSharePost(post)} />
            </div>

            {/* IMAGE AREA */}
            <div className="relative bg-black group aspect-[9/5] rounded-[1.8rem]  flex items-center  justify-center overflow-hidden cursor-pointer" onClick={() => { if (!user) return setShowAuthModal(true); setImagePost(post); setModalIndex(currentImage); }}>
              <img src={images?.[currentImage]?.url} className={`w-full h-full   object-contain transition-all duration-700 group-hover:scale-105 ${!user ? 'blur-sm opacity-60' : ''}`} alt="project" />
              
              {!user && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase shadow-xl">
                    <Lock size={12} className="text-indigo-600" /> Exclusive Content
                  </div>
                </div>
              )}

              {user && images.length > 1 && (
                <>
                  <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between transition-all">
                    <button onClick={(e) => { e.stopPropagation(); setCurrentImage((p) => (p - 1 + images.length) % images.length) }} className="bg-white/10 text-white p-2 rounded-lg backdrop-blur-md"><ChevronLeft size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setCurrentImage((p) => (p + 1) % images.length) }} className="bg-white/10 text-white p-2 rounded-lg backdrop-blur-md"><ChevronRight size={18} /></button>
                  </div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all ${i === currentImage ? "w-4 bg-white" : "w-1 bg-white/40"}`} />)}
                  </div>
                </>
              )}
            </div>

            {/* CONTENT AREA */}
            <div className="p-5 flex flex-col">
             <h3 className="group/title text-[14px] font-black uppercase text-slate-800 mb-4 tracking-tight leading-none">
  {post.title}
  
  <div className="h-[2px] w-8 bg-blue-600 mt-2 transition-all duration-300 group-hover/title:w-16 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
</h3>

              {/* STYLED LINK SECTION */}
              <div 
                onClick={() => {
    if (!user) {
      setShowAuthModal(true);
    } else if (!post.isLinkDead) {
      setPreviewUrl(post.projectLink); 
    } else {
      toast.error("This project link appears to be dead");
    }
  }}    className="group/link relative flex items-center justify-between p-[1px] rounded-xl mb-6 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div className={`absolute inset-0 rounded-xl opacity-10 group-hover/link:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${post.isLinkDead ? "from-red-500 to-orange-500" : "from-indigo-500 via-cyan-400 to-emerald-400"}`} /> 
                <div className="relative w-full flex items-center justify-between bg-white border border-slate-200/50 rounded-[11px] px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-500 ${post.isLinkDead ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600 group-hover/link:bg-blue-600 group-hover/link:text-white"}`}>
                      <Globe size={13} strokeWidth={2.5} />
                    </div>
                    <div className={`flex flex-col truncate transition-all duration-700 ${!user ? "blur-[4.5px] select-none" : ""}`}>
                      <span className="text-[10px] font-bold text-slate-700 truncate tracking-tight group-hover/link:text-blue-700">
                        {user ? post.projectLink?.replace("https://", "").replace("www.", "") : "hidden-project-url-protected"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!user ? (
                      <div className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md"><Lock size={10} /><span className="text-[9px] font-black uppercase">Unlock</span></div>
                    ) : (
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${post.isLinkDead ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600 group-hover/link:bg-emerald-500 group-hover/link:text-white"}`}><span className={`w-1 h-1 rounded-full ${post.isLinkDead ? "bg-red-500" : "bg-emerald-500 group-hover/link:bg-white"} animate-pulse`} />{post.isLinkDead ? "Dead" : "Live"}</div>
                    )}
                    <ExternalLink size={11} className="text-slate-300 group-hover/link:text-blue-500" />
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-slate-600 leading-relaxed mb-6">"{post.description}"</p>
  
              {/* ACTION BAR */}
              <div className="flex justify-between items-center border-t pt-4">
                <div className="flex gap-8">
                  <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleLike(post)}>
                    <Heart size={22} className={`${post.likes?.some((l) => (l._id || l) === user?._id) ? "fill-red-500 text-red-500 scale-110" : "text-slate-300 group-hover:text-red-400"} transition-all`} />
                    <span className="text-xs font-black text-slate-800 hover:text-indigo-600" onClick={(e) => { e.stopPropagation(); !user ? setShowAuthModal(true) : setLikePost(post); }}>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer group" onClick={() => !user ? setShowAuthModal(true) : setCommentPost(post)}>
                    <MessageCircle size={22} className="text-slate-300 group-hover:text-indigo-500" />
                    <span className="text-xs font-black text-slate-800">{post.commentCount || post.comments?.length || 0}</span>
                  </div>
                </div>
          
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block"></div>
      </div>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
          <div className="relative bg-white w-full max-w-[300px] rounded-2xl p-8 shadow-2xl text-center border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4"><ShieldCheck size={24} /></div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Sign in required</h2>
            <p className="text-[12px] text-slate-500 mb-8 leading-relaxed">Join the community to access this DROP .</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/login")} className="w-full bg-indigo-600 text-white text-[13px] font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg">Sign In</button>
              <button onClick={() => setShowAuthModal(false)} className="w-full bg-slate-50 text-slate-600 text-[13px] font-semibold py-3 rounded-xl hover:bg-slate-100 transition-colors">Cancel</button>
            </div>
            <p className="mt-6 text-[11px] text-slate-400 font-bold uppercase">New here? <Link to="/signup" className="text-indigo-600 hover:underline">Create account</Link></p>
          </div>
        </div>
      )}
<AnimatePresence>{previewUrl && (
        <PreviewModal  key={previewUrl} url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}</AnimatePresence>
      {/* MODALS */}
      {imagePost && <ImageModal post={post} modalIndex={modalIndex} setModalIndex={setModalIndex} handleLike={handleLike} onClose={() => setImagePost(null)} setLikePost={setLikePost} setCommentPost={setCommentPost} setSharePost={setSharePost} />}
      {commentPost && <CommentModal post={post} commentText={commentText} setCommentText={setCommentText} submitComment={submitComment} onClose={() => setCommentPost(null)} setCommentPost={setPost} />}
      {sharePost && <ShareModal post={post} onClose={() => setSharePost(null)} />}
      {likePost && <LikeModal post={post} onClose={() => setLikePost(null)} />}
    </div>
  );
}

export default FromShare;