import { toast } from "react-toastify";

// --- ✅ SLIM SUCCESS TOAST ---
const showSuccessToast = (msg) => {
  toast(
    <div className="flex items-center gap-3 py-1.5 px-1 font-sans">

      {/* Icon */}
      <div className="flex-shrink-0 bg-blue-600 p-2 rounded-lg">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col leading-tight">
        <h4 className="text-[13px] font-semibold text-slate-900">
          Welcome back 😊
        </h4>
        <p className="text-[11px] text-slate-500 font-medium">
          {msg}
        </p>
      </div>
    </div>,
    {
      icon: false,
      className:
        "bg-white border border-slate-100 rounded-xl shadow-lg p-0 min-h-[52px]",
      autoClose: 2200,
      closeButton: false,
    }
  );
};


// --- ❌ SLIM ERROR TOAST ---
const showErrorToast = (msg) => {
  toast(
    <div className="flex items-center gap-3 py-1.5 px-1 font-sans">

      <div className="flex-shrink-0 bg-red-500 p-2 rounded-lg">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <h4 className="text-[13px] font-semibold text-slate-900">
          Action Failed
        </h4>
        <p className="text-[11px] text-red-500 font-medium">
          {msg}
        </p>
      </div>
    </div>,
    {
      icon: false,
      className:
        "bg-white border border-red-50 rounded-xl shadow-lg p-0 min-h-[52px]",
      autoClose: 2500,
      closeButton: false,
    }
  );
};


const showErrorToastForSIgnup = (msg) => {
  toast(
    <div className="flex items-center gap-3 py-1.5 px-1 font-sans">

      <div className="flex-shrink-0 bg-red-500 p-2 rounded-lg">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg> 
      </div>

      <div className="flex flex-col leading-tight">
        <h4 className="text-[13px] font-semibold text-slate-900">
          Action Failed
        </h4>
        <p className="text-[11px] text-red-500 font-medium">
          {msg}
        </p>
      </div>
    </div>,
    {
      icon: false,
      className:
        "bg-white border border-red-50 rounded-xl shadow-lg p-0 min-h-[52px]",
      autoClose: 2500,
      closeButton: false,
    }
  );
};

const showSuccessToastForSignup = (msg) => {
  toast(
    <div className="flex items-center gap-3 py-1.5 px-1 font-sans">

      {/* Icon */}
      <div className="flex-shrink-0 bg-blue-600 p-2 rounded-lg">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col leading-tight">
       
        <h4 className="text-[11px] text-black font-medium">
          {msg}
        </h4>
      </div>
    </div>,
    {
      icon: false,
      className:
        "bg-white border border-slate-100 rounded-xl shadow-lg p-0 min-h-[52px]",
      autoClose: 2200,
      closeButton: false,
    }
  );
};

const showSuccessToastForLogout= (msg) => {
  toast(
    <div className="flex items-center gap-3 py-1.5 px-1 font-sans">

      {/* Icon */}
      <div className="flex-shrink-0 bg-blue-600 p-2 rounded-lg">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col leading-tight">
        
        <h4 className="text-[11px] text-black font-medium">
        Successfully Logout ✅
        </h4>
        
      </div>
    </div>,
    {
      icon: false,
      className:
        "bg-white border border-slate-100 rounded-xl shadow-lg p-0 min-h-[52px]",
      autoClose: 2200,
      closeButton: false,
    }
  );
};
const showProfileUpdatedToast = (msg = "Your profile has been updated successfully.") => {
  toast(
    <div className="flex items-center gap-3 py-1.5 px-1">

      {/* Icon */}
      <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col leading-tight">
        
        <h4 className="text-[11px] text-slate-500 font-medium">
          {msg}
        </h4>
      </div>
    </div>,
    {
      icon: false,
      className:
        "bg-white border border-slate-100 rounded-xl shadow-lg p-0 min-h-[52px]",
      autoClose: 2200,
      closeButton: false,
    }
  );
};

export {showProfileUpdatedToast, showSuccessToast, showErrorToast ,showSuccessToastForSignup,showErrorToastForSIgnup,showSuccessToastForLogout};