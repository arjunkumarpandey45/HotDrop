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
import API from "../../api/Api";

function Allpost() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // FIX: Initialize as empty array to prevent .map error
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentPost, setCommentPost] = useState(null);
  const [likePost, setLikePost] = useState(null);
  const [sharePost, setSharePost] = useState(null);
  const [currentImage, setCurrentImage] = useState({});

  useEffect(() => {
    const fetchGlobalFeed = async () => {
      try {
        setLoading(true);
        const res = await API.get("/post/getallposts");
        
        // FIX: Add safety check for array
        const fetchedData = res.data?.data || [];
        setPosts(Array.isArray(fetchedData) ? fetchedData : []);
        
      } catch (error) {
        console.error("Feed Error:", error);
        toast.error("Failed to load feed! 🛑");
        setPosts([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalFeed();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleLike = async (postToLike) => {
    if (!user) return toast.info("Login to like! 😊");
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
    if (!user || !commentText.trim()) return;
    try {
      const res = await API.post(`/post/comment/${commentPost._id}`, { text: commentText });
      const newComment = res.data.data;

      setPosts(prev => prev.map(p => 
        p._id === commentPost._id 
          ? { ...p, comments: [...(p.comments || []), newComment], commentCount: (p.commentCount || 0) + 1 } 
          : p
      ));
      setCommentText("");
      toast.success("Commented! 💬");
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="font-black text-slate-300 uppercase tracking-[0.3em] text-[10px]">Dripping Global Drops...</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 flex items-center justify-between border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
          Explore <span className="text-blue-600 italic">Drops</span>
        </h1>
        <div className="bg-slate-900 text-[9px] font-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest">
          Live Feed
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* FIX: Optional chaining before mapping */}
        {posts?.map((post) => {
          const imgIndex = currentImage[post._id] || 0;
          const owner = post.user || {};

          return (
            <div key={post._id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/user/userprofile/${owner.hotdropId}`)}>
                  <img src={owner.profilePicture || "https://i.pravatar.cc/100"} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-50 group-hover:ring-blue-500 transition-all" alt="u" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase text-slate-800 leading-none">@{owner.hotdropId}</span>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-300 mt-1">
                       <Clock size={10} /> {formatTime(post.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mx-3 bg-slate-950 rounded-3xl aspect-[16/10] flex items-center justify-center overflow-hidden border border-slate-900 shadow-inner group/img">
                <img src={post.images?.[imgIndex]?.url} className="w-full h-full object-contain transition-transform duration-700 group-hover/img:scale-105" alt="post" />
                
                {post.images?.length > 1 && (
                  <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover/img:opacity-100 transition-all">
                    <button onClick={() => setCurrentImage(prev => ({ ...prev, [post._id]: (imgIndex - 1 + post.images.length) % post.images.length }))} className="bg-black/40 backdrop-blur-md p-1.5 rounded-xl text-white hover:bg-black/60"><ChevronLeft size={16} /></button>
                    <button onClick={() => setCurrentImage(prev => ({ ...prev, [post._id]: (imgIndex + 1) % post.images.length }))} className="bg-black/40 backdrop-blur-md p-1.5 rounded-xl text-white hover:bg-black/60"><ChevronRight size={16} /></button>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-[14px] font-black uppercase text-slate-800 mb-4 line-clamp-1">{post.title}</h3>

                <a href={post.projectLink} target="_blank" rel="noreferrer" className="group/link relative flex items-center justify-between p-[1px] rounded-xl mb-5 transition-all">
                  <div className={`absolute inset-0 rounded-xl opacity-10 bg-gradient-to-r ${post.isLinkDead ? 'from-red-500 to-orange-500' : 'from-blue-500 to-cyan-400'}`} />
                  <div className="relative w-full flex items-center justify-between bg-slate-50 border border-slate-100 rounded-[12px] px-3 py-2 shadow-sm group-hover/link:bg-white transition-all">
                    <div className="flex items-center gap-2 truncate">
                      <Globe size={13} className={post.isLinkDead ? "text-red-500" : "text-blue-500"} />
                      <span className="text-[10px] font-black text-slate-700 truncate">{post.projectLink?.replace("https://", "").replace("www.", "")}</span>
                    </div>
                    <ExternalLink size={12} className="text-slate-300 group-hover:text-blue-600" />
                  </div>
                </a>

                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleLike(post)}>
                      <Heart size={20} className={`${post.likes?.some(l => (l._id || l) === user?._id) ? "fill-red-500 text-red-500 scale-110" : "text-slate-300 group-hover:text-red-400"} transition-all`} />
                      <span className="text-[11px] font-black text-slate-800">{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCommentPost(post)}>
                      <MessageCircle size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                      <span className="text-[11px] font-black text-slate-800">{post.comments?.length || 0}</span>
                    </div>
                  </div>
                  <button onClick={() => setSharePost(post)} className="text-slate-300 hover:text-emerald-500 transition-all">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODALS */}
      {commentPost && (
        <CommentModal 
          post={commentPost} 
          commentText={commentText} 
          setCommentText={setCommentText} 
          submitComment={submitComment} 
          onClose={() => setCommentPost(null)} 
          setCommentPost={(updatedPost) => {
             // FIX: Modal updates grid state directly
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