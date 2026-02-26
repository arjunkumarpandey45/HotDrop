import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from "./pages/Navbar.jsx";
import CreatePost from "./pages/CreatePost.jsx";

function App() {
  const [isCreateOpen, setIsCreateOpen] = useState(true);

<<<<<<< HEAD
  return (
    <>
    <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
    <Loader></Loader>
    <Baground raysOrigin="top-center"
    raysColor="#ffffff"
    raysSpeed={1}
    lightSpread={0.5}
    rayLength={3}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0}
    distortion={0}
    className=" bg-[#0f1214]custom-rays"
    pulsating={false}
    fadeDistance={1}
    saturation={1}>
=======
  // Temporary dummy user (jab tak backend connect na ho)
  const user = {
    username: "Arjun",
    hotdropId: "arjun_07",
    profilePicture: ""
  };
>>>>>>> d73fb0ba5faada4c32beae7ee048d03c093120bc

  const logout = () => {
    console.log("Logged out");
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar
            user={user}
            logout={logout}
            onOpenCreate={() => setIsCreateOpen(true)}
          />

          {/* 👇 Create Modal Render */}
          {isCreateOpen && (
            <CreatePost
              onClose={() => setIsCreateOpen(false)}
            />
          )}
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;