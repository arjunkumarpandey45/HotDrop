import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./pages/Navbar.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import UserProfile from "./pages/Profile/EditUserProfile.jsx";
import EditUserProfile from "./pages/Profile/EditUserProfile.jsx";
import Contact from "./pages/Contact.jsx";
import SplashScreen from "./animation/SplashScreen.jsx";
import { useEffect } from "react";
import Login from "./pages/Login.jsx";

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
    profilePicture: ""
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
            <CreatePost
              onClose={() => setIsCreateOpen(false)}
            />
          )}
        </>
      ),
    },
    {
      path: "/profile/:userId",
      element: <><EditUserProfile/></>
    },{
      path:"/contact",
      element:<><Contact></Contact></>
    },
    {
      path:"/login",
      element:<><Login></Login></>
    }
  ]);

  return <> <AnimatePresence>
        {isLoading ? (
          <SplashScreen key="splash" />
        ) : (<RouterProvider router={router} />)}
        
      </AnimatePresence></>
}

export default App;