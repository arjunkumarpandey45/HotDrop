import { X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Navigation ke liye import

function LikeModal({ post, onClose }) {
  const navigate = useNavigate(); // Hook initialize karo

  const handleProfileClick = (hotdropId) => {
    if (!hotdropId) return;
    onClose(); // Profile par jaane se pehle modal band kar do
    navigate(`/user/userprofile/${hotdropId}`); // Navigate to profile
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[600]">
      <div className="bg-white w-[350px] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-800">
            Likes ({post.likes?.length || 0})
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* LIKES LIST */}
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {post.likes && post.likes.length > 0 ? (
            post.likes.map((likedUser, i) => (
              <div 
                key={likedUser._id || i} 
                className="flex gap-3 items-center group cursor-pointer"
                onClick={() => handleProfileClick(likedUser.hotdropId)}
              >
                {/* Avatar */}
                <img
                  src={likedUser.profilePicture || "https://i.pravatar.cc/100"}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50 shadow-sm group-hover:ring-blue-100 transition-all"
                  alt="avatar"
                />

                {/* User Info */}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    @{likedUser.hotdropId || "user"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    View Profile
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              No likes to show
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LikeModal;