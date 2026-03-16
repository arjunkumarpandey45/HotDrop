import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dp from "../../assets/dp.jpg";
function FollowersModal({ isOpen, onClose, users = [] }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div 
      // Background blur aur mobile pe padding p-4 taaki modal chipka na rahe
      className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        // Laptop wala centered design mobile pe bhi (max-w-[380px] aur h-auto)
        className="bg-white w-full max-w-[380px] h-auto max-h-[85vh] rounded-[2rem] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Simple & Focused */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <div className="w-8"></div>
          <h2 className="text-[15px] font-bold text-slate-900">Followers</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-50 rounded-full transition-all"
          >
            <X size={20} className="text-slate-800" />
          </button>
        </div>

        {/* List Container - Scrollable for 100+ users */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-1 py-2">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <p className="text-slate-400 text-sm font-medium">No followers yet.</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {users.map((user, index) => (
                <div 
                  key={user._id || `follower-${index}`} 
                  onClick={() => {
                    navigate(`/user/userprofile/${user.hotdropId}`);
                    onClose();
                  }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer active:scale-[0.98] transition-all rounded-2xl mx-1"
                >
                  <div className="flex items-center gap-3">
                    {/* Circle Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-50 shadow-sm">
                      <img
                        src={user.profilePicture || dp}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* User Info */}
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-slate-900 leading-tight">
                        {user.username}
                      </span>
                      <span className=" text-slate-400 text-[11px] font-bold lowercase tracking-tight">
                        @{user.hotdropId || "anonymous"}
                      </span>
                    </div>
                  </div>

                  {/* View Button */}
                  <button className="bg-slate-100/80 hover:bg-slate-200 text-slate-900 text-[12px] font-bold px-4 py-1.5 rounded-xl transition-all active:scale-95">
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowersModal;