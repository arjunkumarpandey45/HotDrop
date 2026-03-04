import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Trash2,
  X,
  Globe,
  Send,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { showPostSuccessToast, showPostErrorToast  } from "../../Toast/toast"
import API from "../../api/Api";

function UserPost() {

  const { user, updatePostCountLocally } = useAuthStore();

  const [selectedPost, setSelectedPost] = useState(null);
  const [mobileCommentPost, setMobileCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  const [showOptions, setShowOptions] = useState(null);

  const [currentImage, setCurrentImage] = useState({});
  const [modalIndex, setModalIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {

    const resize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);

  }, []);

  const posts = [...(user?.posts || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleDelete = async (postId) => {

    if (!window.confirm("Delete this post?")) return;

    try {

      await API.delete(`/post/deletepost/${postId}`, { withCredentials: true });

      showPostSuccessToast("Post deleted!");

      updatePostCountLocally();

    } catch {

      showPostErrorToast("Delete failed");

    }

  };

  const nextImage = (postId, total) => {

    setCurrentImage((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) + 1) % total,
    }));

  };

  const prevImage = (postId, total) => {

    setCurrentImage((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) - 1 + total) % total,
    }));

  };

  const submitComment = async (e) => {

    e.preventDefault();

    if (!commentText.trim()) return;

    try {

      await API.post(
        `/comment/create/${mobileCommentPost?._id || selectedPost._id}`,
        { text: commentText },
        { withCredentials: true }
      );

      showPostSuccessToast("Comment added");

      setCommentText("");

    } catch {

      showPostErrorToast("Comment failed");

    }

  };

  if (posts.length === 0)
    return (
      <div className="text-center py-20 text-slate-400 text-xs">
        No posts yet
      </div>
    );

  return (

    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {posts.map((post) => {

          const imgIndex = currentImage[post._id] || 0;
          const images = post.images || [];

          return (

            <div
              key={post._id}
              onClick={() => {

                if (!isMobile) {

                  setSelectedPost(post);
                  setModalIndex(0);

                }

              }}
              className="relative bg-white border rounded-2xl overflow-hidden cursor-pointer"
            >

              {/* IMAGE */}

              <div className="aspect-video relative">

                <img
                  src={images?.[imgIndex]?.url}
                  onClick={(e) => {

                    e.stopPropagation();

                    if (isMobile) {

                      window.open(images?.[imgIndex]?.url, "_blank");

                    }

                  }}
                  className="w-full h-full object-cover"
                  alt=""
                />

                {images.length > 1 && (

                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage(post._id, images.length);
                      }}
                      className="absolute left-2 top-1/2 bg-white p-1 rounded-full"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage(post._id, images.length);
                      }}
                      className="absolute right-2 top-1/2 bg-white p-1 rounded-full"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>

                )}

              </div>

              {/* MOBILE CONTENT */}

              {isMobile && (

                <div className="p-4 space-y-2">

                  <h3 className="font-bold text-sm">
                    {post.title}
                  </h3>

                  <div className="flex flex-wrap gap-1">

                    {post.tags?.map((tag, i) => (

                      <span
                        key={i}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-[2px] rounded"
                      >
                        #{tag}
                      </span>

                    ))}

                  </div>

                  <div className="flex items-center gap-2 text-xs">

                    <Globe size={12} />

                    <span className="truncate">
                      {post.projectLink}
                    </span>

                    <span
                      className={`px-2 py-[2px] rounded text-[10px] ${
                        post.isLinkDead
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {post.isLinkDead ? "Dead" : "Live"}
                    </span>

                  </div>

                  <p className="text-xs text-slate-600">
                    {post.description}
                  </p>

                </div>

              )}

              {/* FOOTER */}

              <div className="p-4 flex justify-between">

                <div className="flex gap-4">

                  <div className="flex gap-1 items-center">
                    <Heart size={16} />
                    <span className="text-xs">
                      {post.likes?.length || 0}
                    </span>
                  </div>

                  <div
                    onClick={(e) => {

                      e.stopPropagation();

                      if (isMobile) {

                        setMobileCommentPost(post);

                      } else {

                        setSelectedPost(post);

                      }

                    }}
                    className="flex gap-1 items-center cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    <span className="text-xs">
                      {post.comments?.length || 0}
                    </span>
                  </div>

                </div>

                <Share2 size={16} />

              </div>

            </div>

          );

        })}

      </div>

      {/* DESKTOP MODAL */}

      {!isMobile && selectedPost && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <button
            onClick={() => setSelectedPost(null)}
            className="absolute top-6 right-6 text-white"
          >
            <X size={30} />
          </button>

          <div className="bg-white w-[1100px] h-[650px] flex rounded-3xl overflow-hidden">

            {/* IMAGE */}

            <div className="w-2/3 bg-black flex items-center justify-center">

              <img
                src={selectedPost.images?.[modalIndex]?.url}
                className="object-contain h-full"
              />

            </div>

            {/* RIGHT SIDE INFO */}

            <div className="w-1/3 flex flex-col">

              <div className="p-6 border-b space-y-3">

                <h2 className="font-bold text-lg">
                  {selectedPost.title}
                </h2>

                <div className="flex flex-wrap gap-1">

                  {selectedPost.tags?.map((tag, i) => (

                    <span
                      key={i}
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-[2px] rounded"
                    >
                      #{tag}
                    </span>

                  ))}

                </div>

                <div className="flex items-center gap-2 text-sm">

                  <Globe size={14} />

                  <span className="truncate">
                    {selectedPost.projectLink}
                  </span>

                  <span
                    className={`px-2 py-[2px] rounded text-xs ${
                      selectedPost.isLinkDead
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {selectedPost.isLinkDead ? "Dead" : "Live"}
                  </span>

                </div>

                <p className="text-sm text-slate-600">
                  {selectedPost.description}
                </p>

              </div>

              {/* COMMENTS */}

              <div className="flex-1 overflow-y-auto p-6 space-y-4">

                {selectedPost.comments?.map((c, i) => (

                  <div key={i} className="flex gap-3">

                    <img
                      src={c.user.profilePicture}
                      className="w-8 h-8 rounded-full"
                    />

                    <div>

                      <p className="text-xs font-bold text-blue-600">
                        @{c.user.hotdropId}
                      </p>

                      <p className="text-sm">
                        {c.text}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      )}

      {/* MOBILE COMMENTS */}

      {mobileCommentPost && (

        <div className="fixed inset-0 bg-white z-50 flex flex-col">

          <div className="p-4 border-b flex justify-between">

            <h3 className="font-bold text-sm">Comments</h3>

            <button
              onClick={() => setMobileCommentPost(null)}
            >
              <X size={20} />
            </button>

          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {mobileCommentPost.comments?.map((c, i) => (

              <div key={i} className="flex gap-3">

                <img
                  src={c.user.profilePicture}
                  className="w-8 h-8 rounded-full"
                />

                <div>

                  <p className="text-xs font-bold text-blue-600">
                    @{c.user.hotdropId}
                  </p>

                  <p className="text-sm">
                    {c.text}
                  </p>

                </div>

              </div>

            ))}

          </div>

          <form
            onSubmit={submitComment}
            className="p-4 border-t flex gap-2"
          >

            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border rounded-xl px-4 py-2 text-sm"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-lg"
            >
              <Send size={16} />
            </button>

          </form>

        </div>

      )}

    </div>

  );

}

export default UserPost;