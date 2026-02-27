import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from "./pages/Navbar.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import UserProfile from "./pages/Profile/EditUserProfile.jsx";
import EditUserProfile from "./pages/Profile/EditUserProfile.jsx";
import Contact from "./pages/Contact.jsx";

function App() {
  const [isCreateOpen, setIsCreateOpen] = useState(true);

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
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;