import React, { useEffect, useState } from "react";
import axios from "../../api/Api";
import { Github, Linkedin, Globe, Edit, Loader2, Award, X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { showErrorToast, showProfileUpdatedToast } from "../../Toast/toast";
import EmailModal from "./EmailModal";
import EditProfileModal from "./EditProfileModal";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";
import { Slide, ToastContainer } from "react-toastify";

function EditUserProfile() {
  const { user, setUser } = useAuthStore();
  
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
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

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        hotdropId: user.hotdropId || "",
        bio: user.bio || "",
        github: user.socialLinks?.github || user.github || "",
        linkedin: user.socialLinks?.linkedin || user.linkedin || "",
        portfolio: user.socialLinks?.portfolio || user.portfolio || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  if (!user) return (
    <div className="flex justify-center items-center h-40">
      <Loader2 className="animate-spin text-indigo-600" size={24} />
    </div>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (formDataFromModal) => {
    try {
      setLoading(true);
      const userId = user.userId || user._id;
      
      const res = await axios.put(`/user/bioupdate/${userId}`, formDataFromModal, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000
      });

      const updatedUserFromServer = res.data.data;

      if (updatedUserFromServer) {
        if (setUser) setUser(updatedUserFromServer);
        useAuthStore.setState({ user: updatedUserFromServer });
      }

      showProfileUpdatedToast();
      setShowEditModal(false);
      
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Update failed");
     
    }finally {
      setLoading(false);
    } 
  };

  const getSocialValue = (key) => user.socialLinks?.[key] || user[key];

  return (
    <div className="w-full flex items-center justify-center p-4 bg-[#F9FAFB]">
       <ToastContainer
  position="top-center" 
  autoClose={3000}
  hideProgressBar
  closeButton={false}
  theme="light"
  transition={Slide} 
/>
      <div className="max-w-3xl w-full bg-white rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden relative">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50 bg-slate-50/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase">
              <span className="text-orange-600">HOT</span>
              <span className="text-blue-600">DROP</span>
            </span>
          </div>
         <button
  onClick={() => setShowEditModal(true)}
  className="flex items-center gap-2 px-4 py-1.5 
  rounded-full text-[10px] font-semibold text-white hover:cursor-pointer
  bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600
  shadow-lg shadow-blue-500/20
  transition-all duration-300
  hover:shadow-blue-600/30 hover:-translate-y-0.5
  active:scale-95"
>
  <Edit size={12} />
  EDIT
</button>
        </div>

        <div className="p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          
          {/* Avatar */}
          <div className="relative shrink-0 cursor-pointer group" onClick={() => setShowFullImage(true)}>
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-500 to-blue-500 rounded-full blur-[2px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-white shadow-xl overflow-hidden ring-1 ring-slate-100">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="p" className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-3xl font-semibold text-slate-200 uppercase">
                  {user?.username?.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg border border-slate-50">
              <Award size={16} className="text-orange-500" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{user?.username}</h1>
              <span className="inline-block px-3 py-1 text-[13px] font-bold lowercase w-fit mx-auto md:mx-0 tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
  @{user?.hotdropId}
</span>
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-10 mb-6 border-y md:border-none border-slate-50 py-4 md:py-0">
              {[
                { label: "Posts", count: user?.posts?.length || 0, action: null },
                { label: "Followers", count: user?.followers?.length || 0, action: () => setShowFollowers(true) },
                { label: "Following", count: user?.following?.length || 0, action: () => setShowFollowing(true) }
              ].map((stat, i) => (
                <button key={i} onClick={stat.action} disabled={!stat.action} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 group">
                  <span className="text-lg font-semibold text-slate-900 group-transition-colors">{stat.count}</span>
                  <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{stat.label}</span>
                </button>
              ))}
            </div>

            <p className="text-slate-500 text-xs leading-relaxed max-w-md font-normal mb-8 italic">
              {user?.bio || "Minimalist Creator | Building HotDrop 🚀"}
            </p>

            {/* Socials */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button onClick={() => setShowEmailModal(true)} className="w-full sm:w-auto px-8 py-2 bg-slate-900 text-white rounded-xl font-semibold text-[10px] tracking-widest hover:cursor-pointer  transition-all">
                CONTACT
              </button>
              <div className="flex gap-6">
                {['github', 'linkedin', 'portfolio'].map((key) => {
                  const val = getSocialValue(key);
                  const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Globe;
                  return val ? (
                    <a key={key} href={val} target="_blank" rel="noreferrer" className="text-slate-900 hover:text-blue-500 transition-all hover:-translate-y-1">
                      <Icon size={21} />
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Preview Modal */}
      {showFullImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md" onClick={() => setShowFullImage(false)}>
          <button className="absolute top-8 right-8 text-white/50 hover:text-white">
            <X size={24} />
          </button>
          <img src={user.profilePicture} className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain" alt="P" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Modals */}
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