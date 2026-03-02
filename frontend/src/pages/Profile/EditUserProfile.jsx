import React, { useEffect, useState } from "react";
import axios from "../../api/Api";
import { Github, Linkedin, Globe, Mail, Edit, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { showSuccessToast, showErrorToast } from "../../Toast/toast";
import EmailModal from "./EmailModal";
import EditProfileModal from "./EditProfileModal";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";

function EditUserProfile() {
  const { user, setUser } = useAuthStore();
  
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    hotdropId: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: ""
  });

  // Sync Form Data when store user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        hotdropId: user.hotdropId || "",
        bio: user.bio || "",
        // Handle both direct and nested social links for initial load
        github: user.socialLinks?.github || user.github || "",
        linkedin: user.socialLinks?.linkedin || user.linkedin || "",
        portfolio: user.socialLinks?.portfolio || user.portfolio || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
        gender: user.gender || "",
        profilePicture: user.profilePicture
      });
    }
  }, [user]);

  if (!user) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <Loader2 className="animate-spin text-blue-600" size={24} />
    </div>
  );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ LOGIC UPDATED: Now receives FormData from Modal for image support
  const handleUpdate = async (formDataFromModal) => {
    try {
      setLoading(true);
      
      // Sending Multipart data to Backend
      const res = await axios.put(`/user/bioupdate/${user._id}`, formDataFromModal, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout:30000
      });

      const updatedUserFromServer = res.data.data;

      if (updatedUserFromServer) {
        // Update store globally
        if (setUser) setUser(updatedUserFromServer);
        // Force state sync
        useAuthStore.setState({ user: updatedUserFromServer });
      }

      showSuccessToast("Profile updated successfully ✨");
      setShowEditModal(false);
    } catch (err) {
      console.error("Update Error:", err);
      showErrorToast(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const getSocialValue = (key) => user.socialLinks?.[key] || user[key];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-4 sm:pt-10 px-4 pb-10 selection:bg-blue-200/50 font-sans antialiased">
      
      <div className="max-w-2xl mx-auto bg-white border border-slate-100 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden relative">
        
        {/* Edit Button Inside Card */}
        <button
          onClick={() => setShowEditModal(true)}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 active:scale-95 transition-all duration-300 group"
        >
          <div className="hidden sm:flex items-center px-4 py-1.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all text-[11px]">
            <Edit size={13} className="mr-1.5" />
            Edit Profile
          </div>
          <div className="sm:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl border border-white/20">
            <Edit size={18} strokeWidth={2.5} />
          </div>
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            
            {/* Avatar Section */}
            <div className="shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] overflow-hidden border-2 border-slate-50 shadow-md bg-slate-50">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl font-black text-slate-200 uppercase bg-slate-100">
                    {user?.username?.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-4 pt-1 sm:pt-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                  {user?.username}
                </h1>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-wider">@{user?.hotdropId}</p>
              </div>

              {/* Stats Bar */}
              <div className="flex justify-center sm:justify-start items-center gap-6 py-1 border-y border-slate-50 sm:border-none">
                <div className="text-center sm:text-left">
                  <span className="block text-base font-black text-slate-900 leading-none">{user?.posts?.length || 0}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Posts</span>
                </div>
                <button onClick={() => setShowFollowers(true)} className="text-center sm:text-left group outline-none">
                  <span className="block text-base font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors">{user?.followers?.length || 0}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Followers</span>
                </button>
                <button onClick={() => setShowFollowing(true)} className="text-center sm:text-left group outline-none">
                  <span className="block text-base font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors">{user?.following?.length || 0}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Following</span>
                </button>
              </div>

              {/* Bio */}
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
                {user?.bio || "No bio added yet."}
              </p>

              {/* Action Buttons & Links */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button 
                  onClick={() => setShowEmailModal(true)} 
                  className="w-full sm:w-auto px-5 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-blue-600 transition-all active:scale-95 shadow-sm"
                >
                  Contact
                </button>
                
                <div className="flex items-center gap-1.5">
                  {['github', 'linkedin', 'portfolio'].map((key) => {
                    const val = getSocialValue(key);
                    const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Globe;
                    return val ? (
                      <a key={key} href={val} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-slate-900 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent">
                        <Icon size={16} />
                      </a>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* handleUpdate here will now receive the FormData from the child handleSubmit */}
      <EditProfileModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        formData={formData} 
        handleChange={handleChange} 
        handleUpdate={handleUpdate} 
        loading={loading} 
      />
      
      <FollowersModal isOpen={showFollowers} onClose={() => setShowFollowers(false)} users={user?.followers} />
      <FollowingModal isOpen={showFollowing} onClose={() => setShowFollowing(false)} users={user?.following} />
      <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} email={user?.email} />
    </div>
  );
}

export default EditUserProfile;