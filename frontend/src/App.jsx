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
import { useAuthStore } from "./store/useAuthStore.js";
import Verify from "./auth/Verify.jsx"

import VerifyEmailPage from "./auth/VerifyEmail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <HomeWrapper></HomeWrapper>
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
    element: <VerifyEmailPage/>,
  },
]);

function HomeWrapper() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <Navbar onOpenCreate={() => setIsCreateOpen(true)} />
      {isCreateOpen && <CreatePost onClose={() => setIsCreateOpen(false)} />}
    </>
  );
}
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    // Auth check aur Timer dono ko handle karein
    const initApp = async () => {
      await checkAuth(); // Backend se check karein
      setTimeout(() => {
        setIsLoading(false); // 3.5s ke baad loading khatam
      }, 2000);
    };
    initApp();
  }, [checkAuth]);

  return (
    <>
      {" "}
      <AnimatePresence>
        {isLoading || isCheckingAuth ? (
          <SplashScreen key="splash" />
        ) : (
          <RouterProvider router={router} />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
