import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import {
  Heart,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Trash2,
  ExternalLink,
  MoreVertical,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ImageModal from "../Post/ImageModal";
import CommentModal from "../Post/CommentModal";
import LikeModal from "../Post/LikeModal";
import ShareModal from "./ShareModal";
import API from "../../../api/Api";
import { toast } from "react-toastify";

// 🔥 Added hideOptions prop here
function UserPost({ postsOverride, isOwnerOverride, hideOptions }) {
  const { user } = useAuthStore();
  const [commentText, setCommentText] = useState("");
  const [imagePost, setImagePost] = useState(null);
  const [commentPost, setCommentPost] = useState(null);
  const [likePost, setLikePost] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState({});
  const [menuOpen, setMenuOpen] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sharePost, setSharePost] = useState(null);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* CLOSE MENU ON OUTSIDE CLICK */
  useEffect(() => {
    const closeMenu = () => setMenuOpen(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const posts = postsOverride 
    ? [...postsOverride].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [...(user?.posts || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const nextImage = (e, postId, total) => {
    e.stopPropagation();
    setCurrentImage((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) + 1) % total,
    }));
  };

  const prevImage = (e, postId, total) => {
    e.stopPropagation();
    setCurrentImage((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) - 1 + total) % total,
    }));
  };

  const handleFinalDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    const loadingToast = toast.loading("Removing your drop...");

    try {
      const res = await API.delete(`/post/deletepost/${deleteConfirm._id}`);
      if (res.status === 200 || res.data.success) {
        toast.update(loadingToast, { 
          render: "Drop deleted! 🗑️", type: "success", isLoading: false, autoClose: 2000 
        });

        useAuthStore.setState((state) => ({
          user: {
            ...state.user,
            posts: state.user.posts.filter((p) => p._id !== deleteConfirm._id)
          }
        }));
        setDeleteConfirm(null);
      }
    } catch (error) {
      toast.update(loadingToast, { 
        render: "Failed to delete!", type: "error", isLoading: false, autoClose: 2000 
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await API.post(`/post/comment/${commentPost._id}`, { 
        text: commentText 
      });
      toast.success("Comment added!");
      
      const newPopulatedComment = res.data.data;

      useAuthStore.setState((state) => ({
        user: state.user ? {
          ...state.user,
          posts: state.user.posts.map((p) =>
            p._id === commentPost._id
              ? { 
                  ...p, 
                  comments: [newPopulatedComment, ...(p.comments || [])], 
                  commentCount: (p.commentCount || 0) + 1 
                }
              : p
          )
        } : null
      }));

      setCommentPost((prev) => ({
        ...prev,
        comments: [newPopulatedComment, ...(prev.comments || [])],
        commentCount: (prev.commentCount || 0) + 1
      }));

      if (imagePost && imagePost._id === commentPost._id) {
        setImagePost((prev) => ({
          ...prev,
          comments: [newPopulatedComment, ...(prev.comments || [])],
          commentCount: (prev.commentCount || 0) + 1
        }));
      }
      setCommentText(""); 
    } catch (error) {
      console.error("Comment submit error:", error);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Share2 className="text-slate-300 mb-3" size={24} />
        <div className="text-slate-400 text-[12px] font-semibold uppercase tracking-wider">
          No Drops Yet
        </div>
      </div>
    );
  }

  const handleLike = async (postToLike) => {
    try {
      const res = await API.post(`/post/like/${postToLike._id}`);
      
      if (res.status === 200) {
        const { likeCount, isLiked } = res.data.data;
        
        const currentUserObj = {
          _id: user._id,
          hotdropId: user.hotdropId,
          profilePicture: user.profilePicture
        };

        toast.success(res.data.message || "Updated!");

        useAuthStore.setState((state) => ({
          user: state.user ? {
            ...state.user,
            posts: state.user.posts.map((p) =>
              p._id === postToLike._id
                ? { 
                    ...p, 
                    likeCount: likeCount,
                    likes: isLiked 
                      ? [...(p.likes || []), currentUserObj] 
                      : (p.likes || []).filter(l => (l._id || l) !== user._id)
                  }
                : p
            )
          } : null
        }));

        if (imagePost && imagePost._id === postToLike._id) {
          setImagePost(prev => ({
            ...prev,
            likeCount: likeCount,
            likes: isLiked 
              ? [...(prev.likes || []), currentUserObj] 
              : (prev.likes || []).filter(l => (l._id || l) !== user._id)
          }));
        }

      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Failed to like post");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const imgIndex = currentImage[post._id] || 0;
          const images = post.images || [];

          return (
            <div
              key={post._id}
              className="relative bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
            >
              {/* IMAGE */}
              <div
                className="relative bg-slate-100 cursor-pointer flex items-center justify-center max-h-[260px] overflow-hidden"
                onClick={() => {
                  setImagePost(post);
                  setModalIndex(imgIndex);
                }}
              >
                <img
                  src={images?.[imgIndex]?.url}
                  className="w-full h-full object-contain"
                  alt="post"
                />

                {/* IMAGE SLIDER */}
                {images.length > 1 && (
                  <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between">
                    <button
                      onClick={(e) => prevImage(e, post._id, images.length)}
                      className="bg-black/30 text-white p-1.5 rounded-md"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <button
                      onClick={(e) => nextImage(e, post._id, images.length)}
                      className="bg-black/30 text-white p-1.5 rounded-md"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* DOTS */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full ${
                          i === imgIndex ? "w-4 bg-white" : "w-2 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* 🔥 3 DOT MENU (Hidden if hideOptions is true) */}
                {!hideOptions && (
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === post._id ? null : post._id);
                      }}
                      className="bg-white p-1.5 rounded-md shadow"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {menuOpen === post._id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2  bg-white border rounded-md shadow-md"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(post);
                            setMenuOpen(null);
                          }}
                          className="relative flex items-center gap-3 px-3 py-3 text-[11px] font-extrabold uppercase tracking-widest text-red-500 hover:text-red transition-all duration-300 group overflow-hidden rounded-lg active:scale-95"
                        >
                          <Trash2
                            size={15}
                            className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-1">
                {/* TITLE */}
                <div className="relative mb-3 group/title">
                  <h3 className="text-[13px] font-black uppercase tracking-[0.15em] text-slate-800 leading-none">
                    {post.title}
                  </h3>
                  <div className="h-[2px] w-8 bg-blue-600 mt-1.5 transition-all duration-300 group-hover/title:w-12" />
                </div>

                {/* PROJECT LINK */}
                <a
                  href={post.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link relative flex items-center justify-between p-[1px] rounded-xl mb-4 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {/* Border Glow Layer */}
                  <div
                    className={`absolute inset-0 rounded-xl opacity-10 group-hover/link:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${
                      post.isLinkDead
                        ? "from-red-500 to-orange-500"
                        :"from-blue-500 via-cyan-400 to-emerald-400"
                    }`}
                  /> 

                  {/* Main Compact Body */}
                  <div className="relative w-full flex items-center justify-between bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-[11px] px-3 py-1.5 shadow-sm">
                    <div className="flex items-center gap-2.5 truncate">
                      {/* Mini Icon Container */}
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-500 ${
                          post.isLinkDead
                            ? "bg-red-50 text-red-500"
                            : "bg-blue-50 text-blue-600 group-hover/link:bg-blue-600 group-hover/link:text-white"
                        }`}
                      >
                        <Globe size={13} strokeWidth={2.5} />
                      </div>

                      <div className="flex flex-col truncate">
                        <span className="text-[10px] font-bold text-slate-700 truncate tracking-tight group-hover/link:text-blue-700 transition-colors">
                          {post.projectLink
                            ?.replace("https://", "")
                            .replace("www.", "")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Minimal Live/Dead Pill */}
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${
                          post.isLinkDead
                            ? "bg-red-50 text-red-500"
                            : "bg-emerald-50 text-emerald-600 group-hover/link:bg-emerald-500 group-hover/link:text-white"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${post.isLinkDead ? "bg-red-500" : "bg-emerald-500 group-hover/link:bg-white"} animate-pulse`}
                        />
                        {post.isLinkDead ? "Dead" : "Live"}
                      </div>

                      <ExternalLink
                        size={11}
                        className="text-slate-300 group-hover/link:text-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </a>

                {/* DESCRIPTION */}
                <div className="relative group/desc mb-5">
                  <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-slate-100 group-hover/desc:bg-blue-500/30 transition-colors duration-500 rounded-full" />
                  <p className="text-[11px] leading-[1.6] text-slate-500 font-medium line-clamp-2 transition-colors duration-300 group-hover/desc:text-slate-700 ">
                    <span className="text-blue-500/50 font-black text-sm leading-none mr-0.5 select-none inline-block transform translate-y-1">
                      &ldquo;
                    </span>
                    {post.description}
                    <span className="text-blue-500/50 font-black text-sm leading-none ml-0.5 select-none inline-block transform translate-y-1">
                      &rdquo;
                    </span>
                  </p>
                </div>
                
                <div className="flex items-center  text-[9px] font-bold text-slate-400 ">
                  {post.createdAt ? (
                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                  ) : (
                    <span>just now</span>
                  )}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between  md:hidden items-center mt-auto border-t pt-3">
                  <div className="flex gap-5 items-center">
                    <div className="flex items-center gap-1">
                      <Heart  size={18} onClick={() => handleLike(post)} 
                        className={`cursor-pointer transition-colors ${
                          post.likes?.some(l => (l._id || l) === user._id)
                            ? "fill-red-500 text-red-500" 
                            : "text-slate-400" 
                        }`} 
                      />
                      <span
                        onClick={() => setLikePost(post)}
                        className="text-xs cursor-pointer font-semibold"
                      >
                        {post.likeCount || post.likes?.length || 0}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => setCommentPost(post)}
                    >
                      <MessageCircle size={18} className="text-slate-400" />
                      <span className="text-xs font-semibold">
                        {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>

                  <button onClick={() => setSharePost(post)} className="p-1">
                    <Share2 size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
            onClick={() => !isDeleting && setDeleteConfirm(null)}
          />
          <div className="relative w-full max-w-[320px] bg-white rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-4 shadow-sm">
              <AlertCircle size={26} strokeWidth={2.5} />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-1">
              Delete Drop?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              This action cannot be undone.  
              <br />
              Remove{" "}
              <span className="font-semibold text-slate-900">
                "{deleteConfirm.title}"
              </span>
              ?
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 transition flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {imagePost && (
        <ImageModal
          post={imagePost}
          modalIndex={modalIndex}
          setModalIndex={setModalIndex}
          onClose={() => setImagePost(null)}
          handleLike={handleLike}
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
          setCommentPost={setCommentPost}
          submitComment={submitComment}
          onClose={() => setCommentPost(null)}
        />
      )}

      {sharePost && (
        <ShareModal post={sharePost} onClose={() => setSharePost(null)} />
      )}

      {likePost && (
        <LikeModal post={likePost} onClose={() => setLikePost(null)} />
      )}
    </div>
  );
}

export default UserPost;