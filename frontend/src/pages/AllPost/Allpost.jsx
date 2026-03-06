import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Heart,
  MessageCircle,
  Share2,
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";

import { toast } from "react-toastify";
import CommentModal from "../Profile/Post/CommentModal";
import LikeModal from "../Profile/Post/LikeModal";
import ShareModal from "../Profile/Post/ShareModal";
import ImageModal from "../Profile/Post/ImageModal"; // Wapas add kiya
import API from "../../api/Api";

function Allpost() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentPost, setCommentPost] = useState(null);
  const [likePost, setLikePost] = useState(null);
  const [sharePost, setSharePost] = useState(null);
  const [imagePost, setImagePost] = useState(null); // Image Modal state
  const [modalIndex, setModalIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState({});

  useEffect(() => {
    const fetchGlobalFeed = async () => {
      try {
        setLoading(true);
        const res = await API.get("/post/getallposts"); 
        const fetchedPosts = res.data?.data?.posts || []; 
        setPosts(fetchedPosts);
      } catch (error) {
        toast.error("Feed load nahi ho payi!");
        setPosts([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalFeed();
  }, []);

  const formatTime = (dateString) => {
    if(!dateString) return "just now";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleLike = async (postToLike) => {
    if (!user) return toast.warning("Bhai, pehle login toh kar lo! 😊");
    try {
      const res = await API.post(`/post/like/${postToLike._id}`);
      if (res.status === 200) {
        const { isLiked } = res.data.data;
        const currentUserObj = { _id: user._id, hotdropId: user.hotdropId, profilePicture: user.profilePicture };

        setPosts(prev => prev.map(p => 
          p._id === postToLike._id 
            ? { ...p, likes: isLiked ? [...(p.likes || []), currentUserObj] : p.likes.filter(l => (l._id || l) !== user._id) }
            : p
        ));
        if(isLiked) toast.success("Liked! 🔥", { autoClose: 800 });
      }
    } catch (err) { console.error(err); }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.warning("Login zaroori hai comment ke liye!");
    if (!commentText.trim()) return;
    try {
      const res = await API.post(`/post/comment/${commentPost._id}`, { text: commentText });
      setPosts(prev => prev.map(p => 
        p._id === commentPost._id ? { ...p, comments: [...(p.comments || []), res.data.data], commentCount: (p.commentCount || 0) + 1 } : p
      ));
      setCommentText("");
      toast.success("Commented! 💬");
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-slate-300 tracking-[0.3em] text-[10px] animate-pulse">DRIPPING GLOBAL FEED...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Grid wrapper: Laptop par side columns empty chode hain aapke content ke liye */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT SIDE (Future space) */}
        <div className="hidden lg:block lg:col-span-1">
          {/* Aap yahan kuch bhi rkh sakte ho */}
        </div>

        {/* CENTER FEED (Laptop: 50% width via col-span-2) */}
        <div className="col-span-1 lg:col-span-2 space-y-10">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900">Explore</h1>
            <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Global Feed</div>
          </div>

          {posts.map((post) => {
            const imgIndex = currentImage[post._id] || 0;
            const owner = post.user || {};

            return (
              <div key={post._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/user/userprofile/${owner.hotdropId}`)}>
                    <img src={owner.profilePicture || "https://i.pravatar.cc/100"} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-50" alt="u" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase text-slate-800 leading-none">@{owner.hotdropId}</span>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-300 mt-1 uppercase">
                         <Clock size={10} /> {formatTime(post.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laptop Box Image - Clicks open ImageModal */}
                <div 
                  className="relative mx-3 bg-slate-950 rounded-3xl aspect-[16/10] flex items-center justify-center overflow-hidden border border-slate-900 shadow-inner group cursor-pointer"
                  onClick={() => {
                    setImagePost(post);
                    setModalIndex(imgIndex);
                  }}
                >
                  <img src={post.images?.[imgIndex]?.url} className="w-full h-full object-contain transition-transform duration-700 hover:scale-105" alt="post" />
                  
                  {post.images?.length > 1 && (
                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => ({ ...prev, [post._id]: (imgIndex - 1 + post.images.length) % post.images.length }))}} className="bg-black/40 backdrop-blur-md p-1.5 rounded-xl text-white"><ChevronLeft size={16} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => ({ ...prev, [post._id]: (imgIndex + 1) % post.images.length }))}} className="bg-black/40 backdrop-blur-md p-1.5 rounded-xl text-white"><ChevronRight size={16} /></button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col">
                  <h3 className="text-[15px] font-black uppercase text-slate-800 mb-4">{post.title}</h3>
                  
                  <a href={post.projectLink} target="_blank" rel="noreferrer" className="group/link relative flex items-center justify-between p-[1px] rounded-xl mb-5">
                    <div className={`absolute inset-0 rounded-xl opacity-10 bg-gradient-to-r ${post.isLinkDead ? 'from-red-500 to-orange-500' : 'from-blue-500 to-cyan-400'}`} />
                    <div className="relative w-full flex items-center justify-between bg-slate-50 border border-slate-100 rounded-[12px] px-3 py-2 shadow-sm">
                      <div className="flex items-center gap-2 truncate">
                        <Globe size={13} className={post.isLinkDead ? "text-red-500" : "text-blue-500"} />
                        <span className="text-[10px] font-black text-slate-700 truncate">{post.projectLink?.replace("https://", "").replace("www.", "")}</span>
                      </div>
                      <ExternalLink size={12} className="text-slate-300" />
                    </div>
                  </a>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleLike(post)}>
                        <Heart size={20} className={`${post.likes?.some(l => (l._id || l) === user?._id) ? "fill-red-500 text-red-500 scale-110" : "text-slate-300 group-hover:text-red-400"} transition-all`} />
                        <span className="text-[11px] font-black text-slate-700">{post.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 cursor-pointer group" onClick={() => {
                        if(!user) return toast.warning("Login to comment! 😊");
                        setCommentPost(post);
                      }}>
                        <MessageCircle size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        <span className="text-[11px] font-black text-slate-800">{post.comments?.length || 0}</span>
                      </div>
                    </div>
                    <button onClick={() => setSharePost(post)} className="text-slate-300 hover:text-emerald-500 transition-all"><Share2 size={18} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE (Future space) */}
        <div className="hidden lg:block lg:col-span-1">
          {/* Sidebar content here */}
        </div>
      </div>

      {/* MODALS */}
      {imagePost && (
        <ImageModal
          post={imagePost}
          modalIndex={modalIndex}
          setModalIndex={setModalIndex}
          handleLike={handleLike}
          onClose={() => setImagePost(null)}
          setLikePost={setLikePost}
          setCommentPost={setCommentPost}
          setSharePost={setSharePost}
        />
      )}
      {commentPost && (
        <CommentModal 
          post={commentPost} 
          commentText={commentText} 
          setCommentText={setCommentText} 
          submitComment={submitComment} 
          onClose={() => setCommentPost(null)} 
          setCommentPost={(updatedPost) => {
             setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
          }} 
        />
      )}
      {sharePost && <ShareModal post={sharePost} onClose={() => setSharePost(null)} />}
      {likePost && <LikeModal post={likePost} onClose={() => setLikePost(null)} />}
    </div>
  );
}

export default Allpost;