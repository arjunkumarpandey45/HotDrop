import React, { useState, useEffect, useCallback } from "react"; // useCallback add kiya
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Globe, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Lock, 
  X, 
  ShieldCheck, 
  
} from "lucide-react";
import Sidebar from "../../leftSide/SideBar";
import { toast } from "react-toastify";
import CommentModal from "../Profile/Post/CommentModal";
import LikeModal from "../Profile/Post/LikeModal";
import ShareModal from "../Profile/Post/ShareModal";
import ImageModal from "../Profile/Post/ImageModal"; 
import API from "../../api/Api";
import Sponser from "../Sponser/Sponser";
import dp from "../../assets/dp.jpg";
import PreviewModal from "../Profile/Post/PreviewModal";
import { AnimatePresence } from "framer-motion";
function Allpost() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
const [previewUrl, setPreviewUrl] = useState(null);
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentPost, setCommentPost] = useState(null);
  const [likePost, setLikePost] = useState(null);
  const [sharePost, setSharePost] = useState(null);
  const [imagePost, setImagePost] = useState(null); 
  const [modalIndex, setModalIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 99
  // States for Infinite Scroll
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
const toggleExpand = (e) => {
  e.preventDefault();
  setIsExpanded(!isExpanded);
};
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 1. DATA FETCHING (Wrapped in useCallback to fix infinite loop)
  const fetchGlobalFeed = useCallback(async (pageNum) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setFetchingMore(true);

      const res = await API.get(`/post/getallposts?page=${pageNum}&limit=10`); 
      const { posts: fetchedPosts, hasMore: moreAvailable } = res.data?.data || {};

      if (fetchedPosts) {
        // logic: Pehle batch ko shuffle karo
        const processedBatch = pageNum === 1 
          ? (fetchedPosts.length > 3 
              ? [...fetchedPosts.slice(0, 3), ...shuffleArray(fetchedPosts.slice(3))] 
              : shuffleArray(fetchedPosts))
          : shuffleArray(fetchedPosts);

        // logic: Naya data purane data ke end mein append karo
       setPosts((prev) => {
  if (pageNum === 1) return processedBatch;

  // Sirf wahi posts add karein jo pehle se state mein nahi hain
  const existingIds = new Set(prev.map((p) => p._id));
  const uniqueNewPosts = processedBatch.filter((p) => !existingIds.has(p._id));

  return [...prev, ...uniqueNewPosts];
});
        setHasMore(moreAvailable); 
      }
    } catch (error) {
      toast.error("Failed to load more posts.");
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchGlobalFeed(1);
  }, [fetchGlobalFeed]);

  // 2. SCROLL LISTENER (Infinite Scroll Logic)
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentHeight = window.innerHeight + document.documentElement.scrollTop;

      // logic: Bottom se 200px pehle hi naya data mangwa lo smooth experience ke liye
     if (currentHeight >= scrollHeight - 200 && hasMore && !loading && !fetchingMore) {
  const nextPage = page + 1;
  setPage(nextPage);
  fetchGlobalFeed(nextPage);
}
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, fetchingMore, fetchGlobalFeed]);

  const formatTime = (dateString) => {
    if(!dateString) return "just now";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // 2. LIKE LOGIC (Real-time Sync)
  const handleLike = async (postToLike) => {
    if (!user) return setShowAuthModal(true);
    try {
      const res = await API.post(`/post/like/${postToLike._id}`);
      if (res.status === 200) {
        const { isLiked } = res.data.data;
        const currentUserObj = { 
          _id: user._id, 
          hotdropId: user.hotdropId, 
          username: user.username, 
          profilePicture: user.profilePicture 
        };

        const updateFn = (prev) => prev.map(p => {
          if (p._id === postToLike._id) {
            const filtered = (p.likes || []).filter(l => (l._id || l) !== user._id);
            const updatedLikes = isLiked ? [currentUserObj, ...filtered] : filtered;
            return { ...p, likes: updatedLikes, likeCount: updatedLikes.length };
          }
          return p;
        });

        setPosts(updateFn);
        if (imagePost && imagePost._id === postToLike._id) {
            setImagePost(prev => {
                const filtered = (prev.likes || []).filter(l => (l._id || l) !== user._id);
                const newLikes = isLiked ? [currentUserObj, ...filtered] : filtered;
                return { ...prev, likes: newLikes, likeCount: newLikes.length };
            });
        }
        if(isLiked) toast.success("Liked! 🔥", { autoClose: 800 });
      }
    } catch (err) { toast.error("Action failed"); }
  };

  // 3. COMMENT LOGIC
  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) return setShowAuthModal(true);
    if (!commentText.trim()) return;

    try {
      const res = await API.post(`/post/comment/${commentPost._id}`, { 
        text: commentText 
      });
      
      toast.success("Comment added! ✅");
      const newPopulatedComment = res.data.data;

      const updatedPostObj = { 
        ...commentPost, 
        comments: [newPopulatedComment, ...(commentPost.comments || [])], 
        commentCount: (commentPost.commentCount || 0) + 1 
      };

      setPosts((prevPosts) => prevPosts.map((p) => 
        p._id === commentPost._id ? updatedPostObj : p
      ));

      setCommentPost(updatedPostObj);

      if (imagePost && imagePost._id === commentPost._id) {
        setImagePost(updatedPostObj);
      }

      useAuthStore.setState((state) => ({
        user: state.user ? {
          ...state.user,
          posts: state.user.posts.map((p) =>
            p._id === commentPost._id ? updatedPostObj : p
          )
        } : null
      }));

      setCommentText(""); 
    } catch (error) {
      console.error("Comment error:", error);
      toast.error("Failed to post comment");
    }
  };

  const handleImageClick = (post, index) => {
    if (!user) return setShowAuthModal(true);
    setImagePost(post);
    setModalIndex(index);
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-400 animate-pulse uppercase tracking-[0.3em]">Loading Feed...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfd] py-10 mt-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="hidden lg:block">
          <Sidebar></Sidebar>
        </div>

        <div className="col-span-1 lg:col-span-2 space-y-12">
          {posts.map((post) => {
            const imgIndex = currentImage[post._id] || 0;
            const owner = post.user || {};
            const images = post.images || [];

            return (
              <div key={post._id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/user/userprofile/${owner.hotdropId}`)}>
                    <img src={owner.profilePicture|| dp} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-50 group-hover:ring-indigo-100 transition-all" alt="u" />
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black lowercase leading-none">@{owner.hotdropId}</span>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 mt-1">
                         <Clock size={10} /> {formatTime(post.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Share2 size={18} className="text-slate-400 cursor-pointer hover:text-indigo-400" onClick={() => setSharePost(post)} />
                </div>

                {/* Post Image Area */}
                <div className="relative mx-3 bg-slate-950 rounded-[1rem] aspect-[10/5] flex items-center justify-center overflow-hidden border border-slate-900 group cursor-pointer" onClick={() => handleImageClick(post, imgIndex)}>
                  <img src={images[imgIndex]?.url} className="w-full h-full object-contain transition-all duration-700 group-hover:scale-105" alt="post" />
                  {!user && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="bg-white/90 px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase shadow-xl">
                        <Lock size={12} className="text-indigo-600" /> Exclusive Content
                      </div>
                    </div>
                  )}
                  {images.length > 1 && (
                    <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between transition-all">
                      <button onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => ({ ...prev, [post._id]: (imgIndex - 1 + images.length) % images.length }))}} className="bg-white/10 p-2 rounded-2xl text-white"><ChevronLeft size={18} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => ({ ...prev, [post._id]: (imgIndex + 1) % images.length }))}} className="bg-white/10 p-2 rounded-2xl text-white"><ChevronRight size={18} /></button>
                    </div>
                  )}
                </div>

                {/* Post Body */}
                <div className="p-4 flex flex-col">
                  <h3 className="group/title text-[14px] font-black uppercase text-slate-800 mb-4 tracking-tight leading-none">
  {post.title}
 
  <div className="h-[2px] w-8 bg-blue-600 mt-2 transition-all duration-300 group-hover/title:w-16 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
</h3>

                  {/* Auth Protected Link Section */}
                  <div 
               onClick={(e) => {
                  e.preventDefault();
                  
                  if (!post.isLinkDead) {
                    setPreviewUrl(post.projectLink);
                  } else {
                    toast.error("This project link appears to be dead")
                  }
                }}      className="group/link relative flex items-center  justify-between p-[1px] rounded-xl mb-3 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <div className={`absolute inset-0 rounded-xl opacity-10 group-hover/link:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${post.isLinkDead ? "from-red-500 to-orange-500" : "from-indigo-500 via-blue-400 to-emerald-400"}`} /> 
                    <div className="relative w-full flex items-center justify-between bg-white border border-slate-200/50 rounded-[11px] px-3 py-2 shadow-sm">
                      <div className="flex items-center gap-2.5 truncate">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-500 ${post.isLinkDead ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600 group-hover/link:bg-blue-600 group-hover/link:text-white"}`}><Globe size={13} strokeWidth={2.5} /></div>
                        <div className={`flex flex-col truncate transition-all duration-700 ${!user ? "blur-[4px] select-none" : ""}`}>
                          <span className="text-[10px] font-bold text-slate-700 truncate tracking-tight group-hover/link:text-blue-700 transition-colors">
                            {user ? post.projectLink?.replace("https://", "").replace("www.", "") : "hidden-project-url-protected"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!user ? (
                          <div className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md"><Lock size={10} /><span className="text-[9px] font-black uppercase tracking-tighter">Unlock</span></div>
                        ) : (
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${post.isLinkDead ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600 group-hover/link:bg-emerald-500 group-hover/link:text-white"}`}>
                            <span className={`w-1 h-1 rounded-full ${post.isLinkDead ? "bg-red-500" : "bg-emerald-500 group-hover/link:bg-white"} animate-pulse`} />{post.isLinkDead ? "Dead" : "Live"}
                          </div>
                        )}
                        <ExternalLink size={11} className="text-slate-300 group-hover/link:text-blue-500 transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
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
  </div>
                  {/* Interactions */}
                  <div className="flex gap-8 border-t pt-4">
                    <div className="flex items-center gap-2 cursor-pointer group">
                      <Heart onClick={() => handleLike(post)} size={22} className={`${post.likes?.some(l => (l._id || l) === user?._id) ? "fill-red-500 text-red-500 scale-125" : "text-slate-300 group-hover:text-red-400"} transition-all`} />
                      <span onClick={() => { !user ? setShowAuthModal(true) : setLikePost(post)}} className="text-xs font-black text-slate-800 hover:text-indigo-600">{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { if(!user) return setShowAuthModal(true); setCommentPost(post); }}>
                      <MessageCircle size={22} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-xs font-black text-slate-800">{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* logic: Loading Indicator at bottom */}
          {fetchingMore && (
            <div className="py-10 text-center font-black text-indigo-400 animate-pulse text-[10px] uppercase tracking-widest">
              fetching more drops...
            </div>
          )}

          {/* logic: End message */}
          {!hasMore && posts.length > 0 && (
            <div className="py-20 text-center opacity-20">
               <p className="text-[10px] font-black uppercase tracking-[0.5em]">You've reached the end</p>
            </div>
          )}
        </div>
        <div className="hidden lg:block">
          <Sponser></Sponser>
        </div>
      </div>

     
      {showAuthModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
          <div className="relative bg-white w-full max-w-[300px] rounded-2xl p-6 shadow-xl text-center border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4"><ShieldCheck size={24} /></div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Sign in required</h2>
            <p className="text-[12px] text-slate-500 mb-6">Please login to access this DROP.</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/login")} className="w-full bg-indigo-600 text-white text-[13px] font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-all">Sign In</button>
              <button onClick={() => setShowAuthModal(false)} className="w-full bg-slate-50 text-slate-600 text-[13px] font-semibold py-2.5 rounded-lg hover:bg-slate-100">Cancel</button>
            </div>
            <p className="mt-4 text-[11px] text-slate-400">New here? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create account</Link></p>
          </div>
        </div>
      )}

      {/* Modals synced with posts state */}
      <AnimatePresence>{previewUrl && (
        <PreviewModal  key={previewUrl} url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}</AnimatePresence>
      {imagePost && <ImageModal post={imagePost} modalIndex={modalIndex} setModalIndex={setModalIndex} handleLike={handleLike} onClose={() => setImagePost(null)} setLikePost={setLikePost} setCommentPost={setCommentPost} setSharePost={setSharePost} />}
      {commentPost && <CommentModal post={commentPost} commentText={commentText} setCommentText={setCommentText} submitComment={submitComment} onClose={() => setCommentPost(null)} setCommentPost={(upd) => {
          setPosts(prev => prev.map(p => p._id === upd._id ? upd : p));
          setCommentPost(upd);
          if(imagePost && imagePost._id === upd._id) setImagePost(upd);
      }} />}
      {sharePost && <ShareModal post={sharePost} onClose={() => setSharePost(null)} />}
      {likePost && <LikeModal post={likePost} onClose={() => setLikePost(null)} />}
    </div>
  );
}

export default Allpost;