import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./pages/Navbar.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Signup from "./auth/Signup.jsx";

import EditUserProfile from "./pages/Profile/EditUserProfile.jsx";

import Contact from "./pages/Contact.jsx";
import SplashScreen from "./animation/SplashScreen.jsx";
import { useEffect } from "react";
import Login from "./auth/Login.jsx";
import Verify from "./auth/Verify.jsx";
import EmailVerified from "./auth/VerifyEmail.jsx";

function App() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // 3.5 seconds ka landing animation
    return () => clearTimeout(timer);
  }, []);
  // Temporary dummy user (jab tak backend connect na ho)
  const user = {
    username: "Arjun",
    hotdropId: "arjun_07",
    profilePicture: "",
  };

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
            <CreatePost onClose={() => setIsCreateOpen(false)} />
          )}
        </>
      ),
    },

    {
      path: "/Signup",
      element: (
        <>
          <Signup></Signup>
        </>
      ),
    },

    {
      path: "/profile/:userId",
      element: (
        <>
          <EditUserProfile />
        </>
      ),
    },
    {
      path: "/contact",
      element: (
        <>
          <Contact></Contact>
        </>
      ),
    },
    {
      path: "/login",
      element: (
        <>
          <Login></Login>
        </>
      ),
    },
    {
      path: "/verify",
      element: (
        <>
          <Verify></Verify>
        </>
      ),
    },
    {
  path: "/verify-email/:token",
  element: <EmailVerified />,
}
  ]);

  return (
    <>
      {" "}
      <AnimatePresence>
        {isLoading ? (
          <SplashScreen key="splash" />
        ) : (
          <RouterProvider router={router} />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
