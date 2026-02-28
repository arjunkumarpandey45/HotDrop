import React, { useState } from "react";
import axios from "../../api/Api";
import {
  Edit,
  Save,
  X,
  Github,
  Linkedin,
  Globe,
  Upload,
} from "lucide-react";

function EditUserProfile({ user }) {

  // 🔥 Dummy Data (for testing UI)
  const dummyUser = {
    _id: "123456789",
    username: "ArjunPandey",
    hotdropId: "arjun.dev",
    bio: "Frontend Developer | React & Tailwind Enthusiast 🚀",
    profilePicture: "",
    dateOfBirth: "2005-04-29",
    phoneNumber: "9876543210",
    gender: "male",
    socialLinks: {
      github: "https://github.com/arjunpandey",
      linkedin: "https://linkedin.com/in/arjunpandey",
      portfolio: "https://arjunportfolio.vercel.app",
    },
  };

  const currentUser = user || dummyUser;

  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    bio: currentUser?.bio || "",
    username: currentUser?.username || "",
    hotdropId: currentUser?.hotdropId || "",
    github: currentUser?.socialLinks?.github || "",
    portfolio: currentUser?.socialLinks?.portfolio || "",
    linkedin: currentUser?.socialLinks?.linkedin || "",
    dateOfBirth: currentUser?.dateOfBirth?.substring(0, 10) || "",
    phoneNumber: currentUser?.phoneNumber || "",
    gender: currentUser?.gender || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      if (profilePic) {
        form.append("profilePicture", profilePic);
      }

      await axios.put(
        `/api/user/update/${currentUser._id}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-10 border border-slate-200">

        {/* ================= VIEW MODE ================= */}
        {!isEditing && (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">

            {/* Profile Picture */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
              {currentUser?.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-3xl font-bold">
                  {currentUser?.username?.charAt(0)}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4 text-center md:text-left">

              <div className="flex flex-col md:flex-row items-center gap-4">
                <h2 className="text-2xl font-bold">
                  {currentUser?.username}
                </h2>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100 transition flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>

              <p className="text-slate-500 text-sm">
                @{currentUser?.hotdropId}
              </p>

              <p className="text-slate-700 text-sm">
                {currentUser?.bio}
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-5 mt-3">

                {currentUser?.socialLinks?.github && (
                  <a href={currentUser.socialLinks.github} target="_blank" rel="noopener noreferrer"
                    className="p-2 bg-slate-100 rounded-full hover:bg-black hover:text-white transition">
                    <Github className="h-4 w-4" />
                  </a>
                )}

                {currentUser?.socialLinks?.linkedin && (
                  <a href={currentUser.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="p-2 bg-slate-100 rounded-full hover:bg-blue-600 hover:text-white transition">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}

                {currentUser?.socialLinks?.portfolio && (
                  <a href={currentUser.socialLinks.portfolio} target="_blank" rel="noopener noreferrer"
                    className="p-2 bg-slate-100 rounded-full hover:bg-indigo-600 hover:text-white transition">
                    <Globe className="h-4 w-4" />
                  </a>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ================= EDIT MODE ================= */}
        {isEditing && (
          <div className="space-y-6">

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="input-style" />
              <input name="hotdropId" value={formData.hotdropId} onChange={handleChange} placeholder="Hotdrop ID" className="input-style" />
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input-style" />
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone" className="input-style" />
              <input name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL" className="input-style" />
              <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="input-style" />
              <input name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="Portfolio URL" className="input-style" />
            </div>

            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" className="input-style h-24 resize-none" />

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default EditUserProfile;