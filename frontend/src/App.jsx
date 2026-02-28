import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from "./pages/Navbar.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Signup from "./auth/Signup.jsx";
import verification from "./auth/Verify.jsx";

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
      path:"/Signup",
      element: <><Signup></Signup></>
     }

     
  ]);

  return <RouterProvider router={router} />;
}

export default App;