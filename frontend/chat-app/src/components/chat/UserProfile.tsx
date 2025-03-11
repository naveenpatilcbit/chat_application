import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import withAuth from "@utils/Auth";

export default function UserProfile() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Sample user data; in a real app, fetch from auth context or API.
  const user = {
    name: "John Doe",
    avatarUrl: "https://example.com/avatar.jpg", // Fallback to a default if needed.
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {/* Optionally display the user's name */}
      <Typography variant="subtitle1" sx={{ mr: 1 }}>
        {user.name}
      </Typography>

      <IconButton onClick={handleOpenMenu} size="small">
        <Avatar alt={user.name} src={user.avatarUrl} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
        <MenuItem onClick={handleCloseMenu}>Settings</MenuItem>
        <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}
