import { useState } from "react";
import axios from "axios";
import { Bot, Send, Loader2, MessageCircle, Trash2 } from "lucide-react";

const AiBot = () => {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!message.trim() || loading) return;

    const userMessage = {
      role: "user",
      text: message
    };

    setChat((prev) => [...prev, userMessage]);
    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:8080/bot/chat",
        { message }
      );

      const aiMessage = {
        role: "ai",
        text: res.data.reply
      };

      setChat((prev) => [...prev, aiMessage]);

    } catch (error) {

      setChat((prev) => [
        ...prev,
        { role: "ai", text: "AI failed to respond." }
      ]);

    }

    setLoading(false);
    setMessage("");
  };

  const clearChat = () => {
    setChat([]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {open && (

        <div className="fixed bottom-24 right-6 w-[340px] h-[460px] bg-white z-[1000] shadow-xl border border-slate-200 rounded-xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3">

            <div className="flex items-center gap-2 font-semibold">
              <Bot size={20} />
              HOTDROP Assistant
            </div>

            {/* Clear Chat Button */}
            <button
              onClick={clearChat}
              className="hover:bg-blue-500 p-1 rounded transition"
              title="Clear Chat"
            >
              <Trash2 size={18} />
            </button>

          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">

            {chat.map((msg, index) => (

              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200 text-slate-800"
                  }`}
                >
                  {msg.text}
                </div>

              </div>

            ))}

            {/* Loading Indicator */}
            {loading && (

              <div className="flex items-center gap-2 text-slate-500 text-sm">

                <Loader2 className="animate-spin w-4 h-4" />
                AI is typing...

              </div>

            )}

          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-3 flex gap-2">

            <textarea
              value={message}
              placeholder="Ask something..."
              onChange={(e) => setMessage(e.target.value)}

              onKeyDown={(e) => {

                if (e.key === "Enter" && !e.shiftKey) {

                  e.preventDefault();
                  sendMessage();

                }

              }}

              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none h-10"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center justify-center"
            >
              <Send size={18} />
            </button>

          </div>

        </div>

      )}

    </>
  );
};

export default AiBot;