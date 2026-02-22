import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import Navbar from "./Navbar";
import CreatePost from "./CreatePost.jsx"


const App = () => {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 500);

    
    return () => clearTimeout(timer);
  }, []); 

  
  if (isLoading) {
    return (
      <div className=" flex items-center justify-center h-screen w-screen bg-gray-50 z-50 fixed top-0 left-0">
       
        <CircularProgress style={{ color: '#f97316' }} size={60} />
       
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