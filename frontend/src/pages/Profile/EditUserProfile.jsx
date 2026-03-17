import React, { useEffect, useState } from "react";
import axios from "../../api/Api";
import { Github, Linkedin, Globe, Edit, Loader2, Award, X, Share2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { showErrorToast, showProfileUpdatedToast } from "../../Toast/toast";
import EmailModal from "./EmailModal";
import EditProfileModal from "./EditProfileModal";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";
import ShareProfileModal from "./ShareProfileModal";
import { Slide, ToastContainer } from "react-toastify";
import dp from "../../assets/dp.jpg";
function EditUserProfile() {
  const { user, setUser } = useAuthStore();

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
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
    gender: "",
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
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  if (!user)
    return (
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

      const res = await axios.put(
        `/user/bioupdate/${userId}`,
        formDataFromModal,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        },
      );

      const updatedUserFromServer = res.data.data;

      if (updatedUserFromServer) {
        if (setUser) setUser(updatedUserFromServer);
        useAuthStore.setState({ user: updatedUserFromServer });
      }

      showProfileUpdatedToast();
      setShowEditModal(false);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const getSocialValue = (key) => user.socialLinks?.[key] || user[key];

  return (
    <div className="w-full  flex  justify-center p-4  bg-[#F9FAFB]">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeButton={false}
        theme="light"
        transition={Slide}
      />

      {/* Container with 80% width/40% height on Laptop, 100%/40% on Mobile */}
      <div className="w-full md:w-[80%] h-auto md:h-[47vh] bg-white rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden relative flex flex-col">
        {/* Header - Fixed Height */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-slate-50 bg-slate-50/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase">
              <span className="text-orange-600">HOT</span>
              <span className="text-blue-600">DROP</span>
            </span>
          </div>
          <div className="flex items-center gap-2">

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 shadow-md transition-all hover:scale-105"
          >
            <Share2 size={10} />
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md transition-all hover:scale-105"
          >
            <Edit size={10} /> 
          </button>
          </div>
          
        </div>

        {/* Content Body - Shortened Spacing */}
        <div className="p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10 h-full">
          {/* Avatar - Scaled down slightly */}
          <div
            className="relative shrink-0 cursor-pointer group"
            onClick={() => setShowFullImage(true)}
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500 to-blue-500 rounded-full blur-[1px] opacity-20"></div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-white shadow-lg overflow-hidden ring-1 ring-slate-100">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="p"
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                 <img
                  src={dp}
                  alt="p"
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                />
              )}
            </div>
            <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md border border-slate-50">
              <Award size={14} className="text-orange-500" />
            </div>
          </div>

          {/* Details - Reorganized for vertical Name/ID */}
          <div className="flex-1 text-center md:text-left overflow-hidden">
            <div className="flex flex-col mb-3">
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight leading-tight">
                {user?.username}
              </h1>
              <span className="text-[14px] font-bold lowercase tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent w-fit mx-auto md:mx-0">
                @{user?.hotdropId}
              </span>
            </div>

            {/* Stats - Compact */}
            <div className="flex justify-center md:justify-start gap-8 mb-4">
              {[
                {
                  label: "Posts",
                  count: user?.postCount || 0,
                  action: null,
                },
                {
                  label: "Followers",
                  count: user?.followers?.length || 0,
                  action: () => setShowFollowers(true),
                },
                {
                  label: "Following",
                  count: user?.following?.length || 0,
                  action: () => setShowFollowing(true),
                },
              ].map((stat, i) => (
                <button
                  key={i}
                  onClick={stat.action}
                  disabled={!stat.action}
                  className="flex items-center cursor-pointer  gap-1.5 group"
                >
                  <span className="text-m font-medium text-slate-900">
                    {stat.count}
                  </span>
                  <span className="text-sm font-medium  lowercase text-slate-900  tracking-widest">
                    {stat.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-slate-600 text-[13px] leading-relaxed max-w-sm font-normal mb-5  line-clamp-2">
              {user?.bio || "Minimalist Creator | Tech Enthusiast "}
            </p>

            {/* Socials & Contact */}
            <div className="flex flex-row items-center justify-center md:justify-start gap-5">
              <button
                onClick={() => setShowEmailModal(true)}
                className="px-5 py-1.5 bg-slate-900 text-white rounded-lg font-semibold text-[9px] tracking-widest hover:bg-slate-800 transition-all"
              >
                CONTACT
              </button>
              <div className="flex gap-4">
                {["github", "linkedin", "portfolio"].map((key) => {
                  const val = getSocialValue(key);
                  const Icon =
                    key === "github"
                      ? Github
                      : key === "linkedin"
                        ? Linkedin
                        : Globe;

                  return val ? (
                    <a
                      key={key}
                      href={val}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative  rounded-full bg-slate-50 border border-slate-100 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
                      title={key}
                    >
                      <Icon
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                      />

                      {/* Subtle Dot Indicator on Hover */}
                      <span className="absolute left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
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
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md"
          onClick={() => setShowFullImage(false)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white">
            <X size={24} />
          </button>
          <img
            src={user.profilePicture}
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            alt="P"
            onClick={(e) => e.stopPropagation()}
          />
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
      <FollowersModal
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
        users={user?.followers}
      />
      <FollowingModal
        isOpen={showFollowing}
        onClose={() => setShowFollowing(false)}
        users={user?.following}
      />
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        email={user?.email}
      />
      <ShareProfileModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        user={user}
      />
    </div>
  );
}

export default EditUserProfile;
