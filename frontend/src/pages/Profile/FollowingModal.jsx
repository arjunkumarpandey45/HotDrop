import { X } from "lucide-react";

function FollowingModal({ isOpen, onClose, users = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">

        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Following</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className="space-y-4 max-h-80 overflow-y-auto">
          {users.length === 0 && <p className="text-sm text-slate-500">No followers yet</p>}
          {users.map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <img
                src={user.profilePicture}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-slate-500">@{user.hotdropId}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FollowingModal;