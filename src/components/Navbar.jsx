import { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box,
  Avatar, Menu, MenuItem, ListItemIcon, Divider, Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, handleLogout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const goToProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const onLogout = () => {
    handleMenuClose();
    handleLogout();
  };

  // Get initials for avatar
  const initials = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  return (
    <AppBar position="static" sx={{ background: "linear-gradient(90deg, #1a237e, #0d47a1)" }}>
      <Toolbar>
        <HomeIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          SmartHome
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate("/dashboard")}>Dashboard</Button>
              <Button color="inherit" onClick={() => navigate("/analytics")}>Analytics</Button>
              <Button color="inherit" onClick={() => navigate("/automation")}>Automation</Button>
              <Button color="inherit" onClick={() => navigate("/devices")}>Devices</Button>

              {/* User Avatar with dropdown */}
              <Tooltip title={user?.username || "Account"}>
                <Avatar
                  onClick={handleAvatarClick}
                  sx={{
                    ml: 1,
                    cursor: "pointer",
                    bgcolor: "#42a5f5",
                    width: 36,
                    height: 36,
                    fontSize: 16,
                    fontWeight: "bold",
                    border: "2px solid rgba(255,255,255,0.6)",
                    "&:hover": { bgcolor: "#1976d2", borderColor: "white" },
                    transition: "all 0.2s",
                  }}
                >
                  {initials}
                </Avatar>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    borderRadius: 2,
                    overflow: "visible",
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
              >
                {/* User info header */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {user?.username || "User"}
                  </Typography>
                  {user?.email && (
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  )}
                </Box>

                <Divider />

                <MenuItem onClick={goToProfile} sx={{ py: 1.2 }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  User Profile
                </MenuItem>

                <MenuItem onClick={onLogout} sx={{ py: 1.2, color: "error.main" }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
              <Button color="inherit" variant="outlined" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
