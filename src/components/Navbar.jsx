import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, handleLogout } = useAuth();

  return (
    <AppBar position="static" sx={{ background: "linear-gradient(90deg, #1a237e, #0d47a1)" }}>
      <Toolbar>
        <HomeIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/")}>
          SmartHome
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate("/dashboard")}>Dashboard</Button>
              <Button color="inherit" onClick={() => navigate("/analytics")}>Analytics</Button>
              <Button color="inherit" onClick={() => navigate("/automation")}>Automation</Button>
              <Button color="inherit" variant="outlined" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
              <Button color="inherit" variant="outlined" onClick={() => navigate("/signup")}>Sign Up</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
