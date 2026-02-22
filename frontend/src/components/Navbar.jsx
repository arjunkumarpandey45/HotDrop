import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import "../index.css";
import { useState } from "react";
import { MdMenu, MdSearch, MdNotificationsNone } from "react-icons/md";




const Navbar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Correctly scoped toggle function
  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)} // Added for accessibility
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* MUI Drawer Component */}
      <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>

      <nav className="w-full bg-white py-3 px-4 sm:px-6 shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* LEFT SECTION: Menu & Logo */}
          <div className="flex items-center gap-4 md:w-1/3">
            {/* Wired the toggleDrawer function here */}
            <button 
              onClick={toggleDrawer(true)} 
              className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Open Drawer"
            >
              <MdMenu className="text-gray-600 hover:text-gray-900 text-3xl transition-colors" />
            </button>

            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 text-2xl font-bold tracking-tight cursor-pointer whitespace-nowrap">
              Hot Drop
            </h1>
          </div>

          {/* CENTER SECTION: Desktop Search Bar (Hidden on Mobile) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-full max-w-md border border-gray-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all shadow-inner">
              <MdSearch className="text-gray-500 text-xl" />
              <input
                type="text"
                placeholder="Search for projects..."
                className="bg-transparent outline-none text-gray-800 ml-3 w-full placeholder-gray-500 text-sm"
              />
            </div>
          </div>

          {/* RIGHT SECTION: Mobile Search, Notifications & Profile */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 md:w-1/3 relative">
            {/* Mobile Search Icon */}
            <button className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
              <MdSearch className="text-gray-600 hover:text-gray-900 text-2xl transition-colors" />
            </button>

            {/* Notification */}
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
              <MdNotificationsNone className="text-gray-600 hover:text-gray-900 text-2xl transition-colors" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4">
                9
              </span>
            </button>

            {/* Profile Avatar */}
            <div className="relative pl-2">
              <img
                src="https://i.pravatar.cc/100"
                onClick={() => setOpenProfile(!openProfile)}
                alt="User profile"
                className="h-9 w-9 rounded-full cursor-pointer border-2 border-gray-200 hover:border-orange-400 transition-all object-cover"
              />

              {/* Profile Dropdown */}
              {openProfile && (
                <div className="absolute right-0 top-12 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 w-48 py-2 z-20 overflow-hidden transform transition-all">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm text-gray-900 font-semibold">
                      My Account
                    </p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                    Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                    Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                    Sign Up
                  </button>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;