import {
  Loader2,
  User,
  AtSign,
  Phone,
  Calendar,
  Github,
  Linkedin,
  AlignLeft,
  ChevronDown,
  Camera,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";

function EditProfileModal({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleUpdate,
  loading,
}) {
 
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setPreview(formData.profilePicture || null);
      setSelectedFile(null); 
      document.body.style.overflow = "hidden";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen, formData.profilePicture]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

 const onSubmit = () => {
  const data = new FormData();
  
  data.append("username", formData.username || "");
  data.append("hotdropId", formData.hotdropId || "");
  data.append("bio", formData.bio || "");
  data.append("github", formData.github || "");
  data.append("linkedin", formData.linkedin || "");
  data.append("portfolio", formData.portfolio || "");
  data.append("phoneNumber", formData.phoneNumber || "");
  data.append("dateOfBirth", formData.dateOfBirth || "");
  data.append("gender", formData.gender || "");

  if (selectedFile) {
    data.append("profilePicture", selectedFile);
  }

  handleUpdate(data);
};
  const inputClasses =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm " +
    "text-black outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b shrink-0">
          <button onClick={onClose} className="text-sm font-medium text-gray-500 hover:text-red-500 transition">
            Cancel
          </button>
          <h2 className="text-base font-bold text-slate-800">Edit Profile</h2>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Done"}
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Profile Image Section */}
          <div className="flex justify-center">
            <div className="relative group w-28 h-28">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={48} />
                  </div>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <Camera size={24} className="text-white" />
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-5">
            <Field icon={<User size={14} />} label="Full Name">
              <input name="username" value={formData.username} onChange={handleChange} className={inputClasses} />
            </Field>

            <Field icon={<AtSign size={14} />} label="Hotdrop ID">
              <input name="hotdropId" value={formData.hotdropId} onChange={handleChange} className={inputClasses} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field icon={<Github size={14} />} label="GitHub">
                <input name="github" value={formData.github} onChange={handleChange} className={inputClasses} />
              </Field>
              <Field icon={<Globe size={14} />} label="Portfolio">
                <input name="portfolio" value={formData.portfolio} onChange={handleChange} className={inputClasses} />
              </Field>
            </div>

            <Field icon={<Linkedin size={14} />} label="LinkedIn">
              <input name="linkedin" value={formData.linkedin} onChange={handleChange} className={inputClasses} />
            </Field>

            <Field icon={<Phone size={14} />} label="Phone">
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClasses} />
            </Field>

            <Field icon={<Calendar size={14} />} label="Date of Birth">
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClasses} />
            </Field>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Gender</label>
              <div className="relative">
                <select name="gender" value={formData.gender} onChange={handleChange} className={`${inputClasses} appearance-none`}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <Field icon={<AlignLeft size={14} />} label="Biography">
              <textarea name="bio" value={formData.bio} onChange={handleChange} className={`${inputClasses} h-28 resize-none`} />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

const Field = ({ icon, label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 ml-1">
      <span className="text-slate-500">{icon}</span> {label}
    </label>
    {children}
  </div>
);

export default EditProfileModal;