import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/Api";
// 🔥 Added UserX icon to the imports
import { Github, Linkedin, Globe, Edit, Loader2, Award, X, UserPlus, UserMinus, UserX } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { showErrorToast, showProfileUpdatedToast } from "../Toast/toast";
import EmailModal from "../pages/Profile/EmailModal";
import EditProfileModal from "../pages/Profile/EditProfileModal";
import FollowersModal from "../pages/Profile/FollowersModal";
import FollowingModal from "../pages/Profile/FollowingModal";
import { Slide, ToastContainer } from "react-toastify";
import dp from "../assets/dp.jpg";
import UserPost from "../pages/Profile/Post/UserPost";

function Searcheduser() {
  const { hotdropId } = useParams();
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(user);
  const [isOwner, setIsOwner] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const targetHotdropId = hotdropId || user?.hotdropId;

  useEffect(() => {
    const loadProfile = async () => {
      if (!targetHotdropId) return;
      setLoading(true);
      setProfileUser(null);
      setIsOwner(false);
      setIsFollowing(false);

      try {
        const res = await axios.get(`/user/userprofile/${targetHotdropId}`);
        const profile = res.data.data.user;
        setProfileUser(profile);

        const owner = user?.hotdropId === profile.hotdropId;
        setIsOwner(owner);

        if (user && profile?.followers) {
          const isFollowingNow = profile.followers.some((f) =>
            (typeof f === "string" ? f : f._id).toString() === user._id.toString(),
          );
          setIsFollowing(isFollowingNow);
        }
      } catch (error) {
        showErrorToast(error.response?.data?.message || "Profile not found");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [targetHotdropId, user]);

  useEffect(() => {
    if (profileUser && isOwner) {
      setFormData({
        username: profileUser.username || "",
        hotdropId: profileUser.hotdropId || "",
        bio: profileUser.bio || "",
        github: profileUser.socialLinks?.github || profileUser.github || "",
        linkedin: profileUser.socialLinks?.linkedin || profileUser.linkedin || "",
        portfolio: profileUser.socialLinks?.portfolio || profileUser.portfolio || "",
        phoneNumber: profileUser.phoneNumber || "",
        dateOfBirth: profileUser.dateOfBirth ? profileUser.dateOfBirth.split("T")[0] : "",
        gender: profileUser.gender || "",
      });
    }
  }, [profileUser, isOwner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (formDataFromModal) => {
    try {
      setLoading(true);
      const userId = profileUser.userId || profileUser._id;

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
        setProfileUser(updatedUserFromServer);
      }

      showProfileUpdatedToast();
      setShowEditModal(false);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      setShowLoginCard(true);
      return;
    }

    setFollowLoading(true);
    try {
      const toggleRes = await axios.post("/user/togglefollow", {
        userIdToFollow: profileUser._id,
      });

      const isNowFollowing = toggleRes.data.data?.isFollowing ?? !isFollowing;
      setIsFollowing(isNowFollowing);

      setProfileUser((prev) => ({
        ...prev,
        followerCount: toggleRes.data.data?.followerCount ?? prev.followerCount,
        followers: toggleRes.data.data?.followers ?? prev.followers,
      }));

      const refreshed = await axios.get(`/user/userprofile/${profileUser.hotdropId}`);
      const refreshedProfile = refreshed.data.data.user;
      setProfileUser(refreshedProfile);

      if (setUser) {
        setUser((prev) => {
          if (!prev) return prev;
          const existing = (prev.following || []).map((f) => (typeof f === "string" ? f : f._id));
          const updated = isNowFollowing
            ? [...new Set([...existing, profileUser._id])]
            : existing.filter((id) => id !== profileUser._id);
          return { ...prev, following: updated };
        });
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to toggle follow");
    } finally {
      setFollowLoading(false);
    }
  };

  const getSocialValue = (key) => profileUser.socialLinks?.[key] || profileUser[key];

  // 🔥 UPDATED LOGIC: Separated loading from "User Not Found"
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  // 🔥 NEW: User Not Found UI
  if (!profileUser) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] p-4 bg-[#F9FAFB]">
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center text-center max-w-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <UserX size={32} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">User Not Found</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            We couldn't find the creator you're looking for. They might have changed their HotDrop ID or deleted their account.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:scale-105 transition-all shadow-md"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 p-4 bg-[#F9FAFB]">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeButton={false}
        theme="light"
        transition={Slide}
      />

      <div className="w-full h-auto md:h-[47vh] bg-white rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden relative flex flex-col">
        <div className="flex justify-between items-center px-6 py-3 border-b border-slate-50 bg-slate-50/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase">
              <span className="text-orange-600">HOT</span>
              <span className="text-blue-600">DROP</span>
            </span>
          </div>
          {isOwner && (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md transition-all hover:scale-105"
            >
              <Edit size={10} /> Edit
            </button>
          )}
        </div>

        <div className="p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10 h-full">
          <div
            className="relative shrink-0 cursor-pointer group"
            onClick={() => setShowFullImage(true)}
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500 to-blue-500 rounded-full blur-[1px] opacity-20"></div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-white shadow-lg overflow-hidden ring-1 ring-slate-100">
              <img
                src={profileUser?.profilePicture || dp}
                alt="Profile"
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md border border-slate-50">
              <Award size={14} className="text-orange-500" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left overflow-hidden">
            <div className="flex flex-col mb-3">
              <h1 className="text-xl md:text-xl font-semibold text-slate-900 tracking-tight leading-tight">
                {profileUser?.username}
              </h1>
              <span className="text-[12px] font-bold lowercase tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent w-fit mx-auto md:mx-0">
                @{profileUser?.hotdropId}
              </span>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-4">
              {[
                { label: "Posts", count: profileUser?.posts?.length || 0, action: null },
                { label: "Followers", count: profileUser?.followerCount || 0, action: () => setShowFollowers(true) },
                { label: "Following", count: profileUser?.followingCount || 0, action: () => setShowFollowing(true) },
              ].map((stat, i) => (
                <button
                  key={i}
                  onClick={stat.action}
                  disabled={!stat.action}
                  className="flex items-center gap-1.5 group"
                >
                  <span className="text-m font-medium text-slate-900">{stat.count}</span>
                  <span className="text-sm font-medium lowercase text-slate-900 tracking-widest">{stat.label}</span>
                </button>
              ))}
            </div>

            <p className="text-slate-600 text-[13px] leading-relaxed max-w-sm font-normal mb-5 line-clamp-2">
              {profileUser?.bio || "Minimalist Creator | Tech Enthusiast "}
            </p>

            <div className="flex flex-row items-center justify-center md:justify-start gap-5">
              {!isOwner && (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[9px] font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md transition-all hover:scale-105 disabled:opacity-50"
                >
                  {followLoading ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : isFollowing ? (
                    <><UserMinus size={10} /> Following</>
                  ) : (
                    <><UserPlus size={10} /> Follow</>
                  )}
                </button>
              )}
              <button
                onClick={() => setShowEmailModal(true)}
                className="px-5 py-1.5 bg-slate-900 text-white rounded-lg font-semibold text-[9px] tracking-widest hover:bg-slate-800 transition-all"
              >
                CONTACT
              </button>
              
              <div className="flex gap-4">
                {["github", "linkedin", "portfolio"].map((key) => {
                  const val = getSocialValue(key);
                  const Icon = key === "github" ? Github : key === "linkedin" ? Linkedin : Globe;

                  return val ? (
                    <a
                      key={key}
                      href={val}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative rounded-full bg-slate-50 border border-slate-100 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
                    >
                      <Icon size={18} className="group-hover:scale-110 transition-transform" />
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserPost 
        postsOverride={profileUser.posts} 
        isOwnerOverride={isOwner} 
        hideOptions={true} 
      />

      {showFullImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md"
          onClick={() => setShowFullImage(false)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white">
            <X size={24} />
          </button>
          <img
            src={profileUser.profilePicture || dp}
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            alt="Profile"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

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
        users={profileUser?.followers}
      />
      <FollowingModal
        isOpen={showFollowing}
        onClose={() => setShowFollowing(false)}
        users={profileUser?.following}
      />
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        email={profileUser?.email}
      />
    </div>
  );
}

export default Searcheduser;