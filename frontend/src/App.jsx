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

import ForgotPassword from "./auth/Forgotpassword.jsx";
import VerifyOtp from "./auth/VerifyOtp.jsx"
import ResetPassword from "./auth/ResetPassword.jsx";

import UserPost from "./pages/Profile/Post/UserPost.jsx";
import FromShare from "./pages/Profile/Post/FromShare.jsx";
import ResendVerification from "./auth/ResendVerification.jsx";

// import AiBot from "./ai/Aibot.jsx";
import Hero from "../src/pages/Hero/Hero.jsx";
import NotFound from "./404/NotFound.jsx";
import About from "./pages/About.jsx";
import Searcheduser from "./search/Searcheduser.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <HomeWrapper></HomeWrapper><Hero/>
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
        <EditUserProfile /><UserPost></UserPost>
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
  {
    path: "/email-for-reverify",
    element: (
      <>
       <ResendVerification></ResendVerification>
      </>
    ),
  },
  {
    path:"/forgot-password",
    element:(
      <>
<ForgotPassword></ForgotPassword>
      </>
    )
  },
  {
    path:"/verify-otp/:email",
    element:(
      <>
<VerifyOtp></VerifyOtp>
      </>
    )
  },
  {
    path:"/reset-password",
    element:(
      <>
<ResetPassword></ResetPassword>
      </>
    )
  },{
    path:"/getpost/:postId",
    element:<><FromShare></FromShare></>
  },
  {
    path:"/user/userprofile/:hotdropId",
    element:<><Searcheduser></Searcheduser></>
  },
  {
    path:"*",
    element:<><NotFound></NotFound></>
  },{
    path:"/about",
    element:<><About></About></>
  }
  
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
        setIsLoading(false); // 2s ke baad loading khatam
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
      {/* <AiBot></AiBot> */}
    </>
  );
}

export default App;
