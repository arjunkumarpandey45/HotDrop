import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import "react-toastify/dist/ReactToastify.css";
function Contact() {
  const form = useRef();
  const [loading, setLoading] = useState(false);
const service =import.meta.env.VITE_EMAILJS_SERVICE_ID;
const template = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
useEffect(() => {
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }, [publicKey]);
  const sendEmail = async (e) => {
    e.preventDefault();
    if (loading) return;
if (!service || !template || !publicKey) {
      toast.error("Config missing! Check .env file 🔑");
      return;
    }
    setLoading(true);

    try {
      await emailjs.sendForm(
        service,
        template,
        form.current,
        publicKey
      );

      form.current.reset();

      toast.success("Message sent successfully 🚀", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Failed to send message ❌", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <ToastContainer />

      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT INFO PANEL */}
        <div className="bg-blue-600 text-white p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">
            Let's Talk 👋
          </h2>
          <p className="text-blue-100 mb-6">
            Have a project in mind?  
            Feel free to reach out. We always open to discussing new ideas,
            collaborations or opportunities.
          </p>

          <div className="space-y-3 text-sm">
        
         
            <p>💼 Available for freelance</p>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="bg-white/70 backdrop-blur-lg p-10">
          <form ref={form} onSubmit={sendEmail} className="space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.03]"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}

export default Contact;