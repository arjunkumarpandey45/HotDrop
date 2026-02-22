import * as React from "react";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { FaRobot } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

const actions = [
  { icon: <FaPlus />, name: "Create " },
  { icon: <FaRegEdit />, name: "Edit " },
    { icon: <FaRobot />, name: "Chat " },
];

const CrestePost = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
  

<Box sx={{ flexGrow: 1 }}>
  <Backdrop open={open} />
  
  
  <SpeedDial
    ariaLabel="SpeedDial tooltip example"
    sx={{ 
      position: "fixed", 
      bottom: 16,        
      right: 16          
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
