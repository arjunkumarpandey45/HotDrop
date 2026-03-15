import React, { useEffect, useState } from "react";
import { X, Send, MessageSquare, Trash2, AlertCircle, Loader2 } from "lucide-react";
import api from "../../../api/Api";
import { useAuthStore } from "../../../store/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dp from "../../../assets/dp.jpg";

function CommentModal({
  post,
  commentText,
  setCommentText,
  submitComment,
  onClose,
  setCommentPost,
}) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localComments, setLocalComments] = useState(post?.comments || []);

  useEffect(() => {
    setLocalComments(post?.comments || []);
  }, [post?._id, post?.comments]);

  const removeById = (comments = [], id) =>
    comments.filter((c) => String(c?._id) !== String(id));

  const handleDeleteComment = async (commentId) => {
    if (isDeleting) return;
    setIsDeleting(true);

    const loadingToast = toast.loading("Removing comment...");

    try {
      const res = await api.delete(`/post/deletecomment/${post._id}/${commentId}`);

      if (res.status === 200 || res.data.success) {
        const updatedPost = {
          ...post,
          comments: removeById(post?.comments || [], commentId),
          commentCount: Math.max(
            0,
            (post?.commentCount ?? (post?.comments || []).length) - 1
          ),
        };

        setLocalComments((prev) => removeById(prev, commentId));

        useAuthStore.setState((state) => ({
          user: state.user
            ? {
                ...state.user,
                posts: (state.user.posts || []).map((p) =>
                  p._id === post._id
                    ? {
                        ...p,
                        comments: removeById(p.comments || [], commentId),
                        commentCount: Math.max(
                          0,
                          (p.commentCount ?? (p.comments || []).length) - 1
                        ),
                      }
                    : p
                ),
              }
            : null,
        }));

        if (setCommentPost) {
          setCommentPost(updatedPost);
        }

        toast.success("Comment deleted! 🗑️", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Failed to delete", { id: loadingToast });
    } finally {
      setDeleteConfirm(null);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText?.trim()) return;

    try {
      setIsSubmitting(true);
      await submitComment(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[600] flex items-center justify-center p-4">
      {deleteConfirm && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => !isDeleting && setDeleteConfirm(null)}
          />
          <div className="relative bg-white w-[260px] rounded-xl p-5 shadow-xl text-center">
            <div className="flex justify-center mb-3 text-red-500">
              <AlertCircle size={28} />
            </div>
            <h4 className="font-semibold text-sm text-slate-800 mb-1">
              Delete Comment?
            </h4>
            <p className="text-[11px] text-slate-400 mb-4">This cannot be undone</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 py-2 text-xs bg-slate-100 rounded-md disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComment(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 py-2 text-xs bg-red-500 text-white rounded-md disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-lg h-[520px] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <MessageSquare size={18} />
            </div>
            <h3 className="font-semibold text-sm text-slate-800">
              Comments ({localComments.length || 0})
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {localComments.length > 0 ? (
            [...localComments]
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((c, i) => {
                const currentUserId = String(user?._id || "");
                const commentAuthorId = String(c.user?._id || c.user || "");
                const postOwnerId = String(post.user?._id || post.user || "");
                const canDelete =
                  currentUserId === commentAuthorId || currentUserId === postOwnerId;

                return (
                  <div key={c._id || i} className="flex gap-3 group">
                    <img
                      src={c.user?.profilePicture || dp}
                      className="w-9 h-9 rounded-full object-cover"
                      alt="avatar"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span
                          onClick={() => navigate(`/user/userprofile/${c.user?.hotdropId}`)}
                          className="text-[13px] font-semibold text-black cursor-pointer"
                        >
                          @{c.user?.hotdropId || "user"}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {formatDate(c.createdAt)}
                        </span>
                      </div>

                      <div className="relative group/bubble">
                        <div className="bg-slate-50 px-3 py-2 rounded-xl mt-1 max-w-full">
                          <p className="text-[13px] text-slate-600 break-words whitespace-pre-wrap">
                            {c.text}
                          </p>
                        </div>

                        {canDelete && (
                          <button
                            onClick={() => setDeleteConfirm(c._id)}
                            className="absolute -right-2 -bottom-2 p-1.5 bg-white border border-slate-100 text-red-400 rounded-md shadow-sm z-10 opacity-100 md:opacity-0 md:group-hover/bubble:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <MessageSquare size={38} />
              <p className="text-[11px] mt-2">No feedback yet</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-slate-50">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-white p-2 rounded-xl border"
          >
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              autoFocus
              placeholder="Share your thoughts..."
              className="flex-1 text-[13px] outline-none"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!commentText?.trim() || isSubmitting}
              className="bg-slate-900 px-4 py-2 rounded-lg text-xs flex items-center gap-1 text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md transition-all disabled:bg-slate-200"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
