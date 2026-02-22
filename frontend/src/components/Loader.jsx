import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import Navbar from "./Navbar";
import CreatePost from "./CreatePost.jsx"
import myLogo from "../assets/Video_Animation_With_Removed_Logos-ezgif.com-gif-maker.gif";

const App = () => {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 1000);

    
    return () => clearTimeout(timer);
  }, []); 

  
  if (isLoading) {
    return (
      // <div className=" flex items-center justify-center h-screen w-screen bg-gray-50 z-50 fixed top-0 left-0">
       
      //   <CircularProgress style={{ color: '#f97316' }} size={60} />
       
      // </div>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50">
        
        {/* 2. Replace the MUI spinner with your image */}
        <img 
          src={myLogo}
          alt="Loading Hot Drop..." 
          // Use Tailwind to control the size (w-24 = 6rem/96px)
          className="w-24 h-24 object-contain" 
        />

      </div>
    );
  }


  return (
    <>
    <Navbar></Navbar>
   <CreatePost></CreatePost>
    </>
  );
};

export default App;