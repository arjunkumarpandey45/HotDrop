import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Bot, Send, Trash2, X, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const AiBot = () => {

const [open,setOpen] = useState(false);
const [message,setMessage] = useState("");
const [chat,setChat] = useState([]);
const [loading,setLoading] = useState(false);

const chatRef = useRef(null);
const lastMessageRef = useRef(null);

/* AUTH STATE */

const { user } = useAuthStore();
const isLoggedIn = !!user;


/* AUTO SCROLL */

useEffect(()=>{
lastMessageRef.current?.scrollIntoView({behavior:"smooth"});
},[chat,loading]);


/* OUTSIDE CLICK CLOSE */

useEffect(()=>{

const handleClickOutside = (e)=>{

if(chatRef.current && !chatRef.current.contains(e.target)){
setOpen(false);
}

};

if(open){
document.addEventListener("mousedown",handleClickOutside);
}

return ()=>document.removeEventListener("mousedown",handleClickOutside);

},[open]);


/* SEND MESSAGE */

const sendMessage = async ()=>{

if(!message.trim() || loading) return;

const userMsg = {role:"user",text:message};

setChat(prev=>[...prev,userMsg]);

setMessage("");
setLoading(true);

try{

const res = await axios.post(
"http://localhost:8080/bot/chat",
{message}
);

setChat(prev=>[
...prev,
{role:"ai",text:res.data.reply}
]);

}catch{

setChat(prev=>[
...prev,
{role:"ai",text:"Neural connection error. Retry!"}
]);

}

setLoading(false);

};

const clearChat = ()=>setChat([]);

return (

<>

{/* overlay */}

{open && (
<div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"/>
)}

{/* floating bot button */}

<button
onClick={()=>setOpen(!open)}
className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 z-50 bg-gradient-to-br from-indigo-600 to-purple-700 hover:scale-110"
>

{open
? <X size={26} className="text-white"/>
: (
<div className="relative flex items-center justify-center">

<div className="absolute w-16 h-16 rounded-full bg-indigo-500 blur-xl opacity-40 animate-pulse"></div>

<Bot size={30} className="text-white relative z-10"/>

</div>
)}

</button>


{/* CHAT WINDOW */}

{open && (

<div
ref={chatRef}
className="fixed bottom-24 right-6 w-[88vw] sm:w-[340px] h-[460px] bg-white/90 backdrop-blur-xl border border-indigo-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50"
>

{/* USER NOT SIGNED IN */}

{!isLoggedIn ? (

<div className="flex flex-col items-center justify-center h-full text-center p-6">

<Bot size={40} className="text-indigo-600 mb-4"/>

<h3 className="text-lg font-semibold">
Create an account
</h3>

<p className="text-sm text-gray-500 mt-2">
Sign up to start chatting with HotDrop AI.
</p>

<button
onClick={()=>window.location.href="/signup"}
className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
>
Sign Up
</button>

</div>

) : (

<>

{/* HEADER */}

<div className="px-4 py-3 flex items-center justify-between border-b border-indigo-50 bg-white/70">

<div className="flex items-center gap-2">

<Bot size={18} className="text-indigo-600"/>

<h3 className="text-xs font-bold tracking-wide">

<span className="text-orange-500">HOT</span>
<span className="text-blue-600">DROP</span>
<span className="text-slate-400"> AI</span>

</h3>

</div>

<button
onClick={clearChat}
className="text-slate-300 hover:text-red-500"
>
<Trash2 size={16}/>
</button>

</div>


{/* CHAT STREAM */}

<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">

{chat.length===0 && (

<div className="flex flex-col items-center justify-center h-full text-slate-300 text-sm">
Hey Need Help!
</div>

)}

{chat.map((msg,i)=>(

<div
key={i}
className={`flex ${
msg.role==="user"
? "justify-end"
: "justify-start"
}`}
>

<div
className={`px-4 py-2 text-sm max-w-[75%] rounded-xl ${
msg.role==="user"
? "bg-slate-900 text-white rounded-tr-none"
: "bg-white border border-indigo-100 text-slate-800 rounded-tl-none"
}`}
>

{msg.role==="ai"
? <ReactMarkdown>{msg.text}</ReactMarkdown>
: msg.text}

</div>

</div>

))}

{loading && (

<div className="flex items-center gap-2 text-slate-500 text-sm">

<Loader2 className="animate-spin w-4 h-4"/>

AI is typing...

</div>

)}

<div ref={lastMessageRef}/>

</div>


{/* INPUT */}

<div className="p-3 bg-white border-t border-indigo-50">

<div className="relative">

<textarea
value={message}
placeholder="Hot Drop AI..."
onChange={(e)=>setMessage(e.target.value)}
onKeyDown={(e)=>{
if(e.key==="Enter" && !e.shiftKey){
e.preventDefault();
sendMessage();
}
}}
className="w-full bg-slate-50 border border-indigo-100 rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:border-indigo-500 resize-none h-10"
/>

<button
onClick={sendMessage}
disabled={!message.trim() || loading}
className="absolute right-1 top-1 bottom-1 w-8 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-30 flex items-center justify-center"
>

<Send size={14}/>

</button>

</div>

<p className="text-[9px] text-center mt-1 text-slate-400 font-semibold uppercase tracking-wider">
HotDrop AI
</p>

</div>

</>

)}

</div>

)}

</>

);

};

export default AiBot;