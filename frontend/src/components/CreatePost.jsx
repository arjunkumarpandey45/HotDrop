import * as React from "react";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";

import { FaRegEdit } from "react-icons/fa";

const actions = [
  { icon: <FileCopyIcon />, name: "Create post" },
  { icon: <FaRegEdit />, name: "Edit Post" },
  
];

const CrestePost = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
  

<Box sx={{ flexGrow: 1 }}>
  <Backdrop open={open} />
  
  {/* The SpeedDial is now pinned to the screen */}
  <SpeedDial
    ariaLabel="SpeedDial tooltip example"
    sx={{ 
      position: "fixed", // Keeps it floating on the screen
      bottom: 16,        // 16px from the bottom edge
      right: 16          // 16px from the right edge
    }}
    icon={<SpeedDialIcon />}
    onClose={handleClose}
    onOpen={handleOpen}
    open={open}
  >
    {actions.map((action) => (
      <SpeedDialAction
        key={action.name}
        icon={action.icon}
        slotProps={{
          tooltip: {
            open: true,
            title: action.name,
          },
        }}
        onClick={handleClose}
      />
    ))}
  </SpeedDial>
</Box>


  );
};

export default CrestePost;
