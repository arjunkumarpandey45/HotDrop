import { X, Mail } from "lucide-react";

function EmailModal({ isOpen, onClose, email }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Mail size={18} />
            Contact Email
          </div>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 text-sm text-gray-700 break-all">
          {email}
        </div>

      </div>
    </div>
  );
}

export default EmailModal;