import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";

import CommentModal from "../Post/CommentModal";
import LikeModal from "../Post/LikeModal";
import ShareModal from "./ShareModal";
import API from "../../../api/Api";
import { toast } from "react-toastify";

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
  if (!user) return toast.warning("Login to like this Drop!");

  try {
    const res = await API.post(`/post/like/${postToLike._id}`);

    if (res.status === 200) {
      const { isLiked, likeCount } = res.data.data; // Backend se likeCount mangwao

      const currentUserObj = {
        _id: user._id,
        hotdropId: user.hotdropId,
        profilePicture: user.profilePicture,
      };

      // logic: LOCAL STATE UPDATE (For FromShare Page)
      setPost((prev) => ({
        ...prev,
        likes: isLiked
          ? [...(prev.likes || []), currentUserObj]
          : (prev.likes || []).filter((l) => (l._id || l) !== user._id),
      }));

      // logic: ZUSTAND STORE UPDATE (For Modals & Global Sync)
      useAuthStore.setState((state) => ({
        user: state.user ? {
          ...state.user,
          posts: state.user.posts?.map((p) =>
            p._id === postToLike._id
              ? { 
                  ...p, 
                  likes: isLiked 
                    ? [...(p.likes || []), currentUserObj] 
                    : (p.likes || []).filter(l => (l._id || l) !== user._id)
                }
              : p
          )
        } : null
      }));

      if (isLiked) toast.success("Liked 🔥");
      else toast.info("Unliked");
    }
  } catch (error) {
    toast.error("Action failed");
  }
};
const submitComment = async (e) => {
  e.preventDefault();
  if (!user) return toast.info("Login to comment!");
  if (!commentText.trim()) return;

  try {
    const res = await API.post(`/post/comment/${post._id}`, {
      text: commentText,
    });

    const newComment = res.data.data;

    // 1. LOCAL STATE UPDATE
    setPost((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));

    // 2. ZUSTAND STORE UPDATE
    useAuthStore.setState((state) => ({
      user: state.user ? {
        ...state.user,
        posts: state.user.posts?.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...(p.comments || []), newComment] }
            : p
        )
      } : null
    }));

    setCommentText("");
    toast.success("Commented 💬");
  } catch (error) {
    toast.error("Error adding comment");
  }
};
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-black text-slate-300 tracking-widest uppercase animate-pulse">
        Loading...
      </div>
    );

  if (!post)
    return (
      <div className="h-screen flex items-center justify-center font-black text-slate-800">
        404 NOT FOUND
      </div>
    );

  const images = post.images || [];
  const owner = post.user || {};

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 flex justify-center">
      <div className="w-full max-w-[360px]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-full transition text-slate-400 hover:text-slate-900 shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>

         <div className="text-[14px] font-black tracking-[0.2em] uppercase ">
  <span className="text-orange-500">Hot</span>
  <span className="text-blue-600">Drop</span>
</div>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
          {/* PROFILE */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/user/userprofile/${owner.hotdropId}`)}
            >
              <img
                src={owner.profilePicture}
                className="w-8 h-8 rounded-full object-cover"
                alt="avatar"
              />

              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-800">
                  {owner.username}
                </span>

                <span className="text-[10px] font-semibold text-blue-600">
                  @{owner.hotdropId}
                </span>
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="relative bg-black group">
            <div className="aspect-[5/3] flex items-center justify-center overflow-hidden">
              <img
                src={images?.[currentImage]?.url}
                className="w-full h-1000 object-contain"
                alt="project"
              />
            </div>

            {images.length > 1 && (
              <>
                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between">
                  <button
                    onClick={() =>
                      setCurrentImage(
                        (p) => (p - 1 + images.length) % images.length,
                      )
                    }
                    className="bg-black/40 text-white p-2 rounded-lg"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    onClick={() =>
                      setCurrentImage((p) => (p + 1) % images.length)
                    }
                    className="bg-black/40 text-white p-2 rounded-lg"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* DOTS */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full ${
                        i === currentImage ? "w-4 bg-white" : "w-1 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-4 flex flex-col">
            <h2 className="text-[15px] font-bold text-slate-900 mb-3">
              {post.title}
            </h2>

            {/* PROJECT LINK */}
            <a
              href={post.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link relative flex items-center justify-between p-[1px] rounded-xl mb-4 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            >
            
              <div
                className={`absolute inset-0 rounded-xl opacity-10 group-hover/link:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${
                  post.isLinkDead
                    ? "from-red-500 to-orange-500"
                    :"from-blue-500 via-cyan-400 to-emerald-400"
                }`}
              /> 
              <div className="relative w-full flex items-center justify-between bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-[11px] px-3 py-1.5 shadow-sm">
           
                <div className="flex items-center gap-2.5 truncate">
              
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-500 ${
                      post.isLinkDead
                        ? "bg-red-50 text-red-500"
                        : "bg-blue-50 text-blue-600 group-hover/link:bg-blue-600 group-hover/link:text-white"
                    }`}
                  >
                                           {" "}
                    <Globe size={13} strokeWidth={2.5} />                   
                     {" "}
                  </div>
                                       {" "}
                  <div className="flex flex-col truncate">
                                           {" "}
                    <span className="text-[10px] font-bold text-slate-700 truncate tracking-tight group-hover/link:text-blue-700 transition-colors">
                                               {" "}
                      {post.projectLink
                        ?.replace("https://", "")
                        .replace("www.", "")}
                                             {" "}
                    </span>
                                         {" "}
                  </div>
                                     {" "}
                </div>
                                   {" "}
                <div className="flex items-center gap-2">
                                 
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${
                      post.isLinkDead
                        ? "bg-red-50 text-red-500"
                        : "bg-emerald-50 text-emerald-600 group-hover/link:bg-emerald-500 group-hover/link:text-white"
                    }`}
                  >
                                           {" "}
                    <span
                      className={`w-1 h-1 rounded-full ${post.isLinkDead ? "bg-red-500" : "bg-emerald-500 group-hover/link:bg-white"} animate-pulse`}
                    />
                                            {post.isLinkDead ? "Dead" : "Live"} 
                                       {" "}
                  </div>
                                       {" "}
                  <ExternalLink
                    size={11}
                    className="text-slate-300 group-hover/link:text-blue-500 transition-all"
                  />
                                     {" "}
                </div>
                                 {" "}
              </div>
                             {" "}
            </a>

            {/* DESCRIPTION */}
            <p className="text-[12px] text-slate-600  leading-relaxed mb-4">
              "{post.description}"
            </p>

            {/* ACTION BAR */}
            <div className="flex justify-between items-center border-t pt-3">
              <div className="flex gap-6">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleLike(post)}
                >
                  <Heart
                    size={20}
                    className={`${
                      post.likes?.some((l) => (l._id || l) === user?._id)
                        ? "fill-red-500 text-red-500"
                        : "text-slate-400"
                    }`}
                  />

                  <span
                    className="text-xs font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLikePost(post);
                    }}
                  >
                    {post.likes?.length || 0}
                  </span>
                </div>

                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setCommentPost(post)}
                >
                  <MessageCircle size={20} className="text-slate-400" />

                  <span className="text-xs font-semibold">
                    {post.comments?.length || 0}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSharePost(post)}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <Share2 size={18} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}

      {commentPost && (
        <CommentModal
          post={post}
          commentText={commentText}
          setCommentText={setCommentText}
          submitComment={submitComment}
          onClose={() => setCommentPost(null)}
          setCommentPost={setPost}
        />
      )}

      {sharePost && (
        <ShareModal post={post} onClose={() => setSharePost(null)} />
      )}

      {likePost && <LikeModal post={post} onClose={() => setLikePost(null)} />}
    </div>
  );
}

export default FromShare;
