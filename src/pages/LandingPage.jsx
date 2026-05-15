import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SecurityIcon from "@mui/icons-material/Security";
import BoltIcon from "@mui/icons-material/Bolt";
import DevicesIcon from "@mui/icons-material/Devices";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: <DevicesIcon fontSize="large" color="primary" />, title: "Device Control", desc: "Control all your smart devices from one place." },
  { icon: <BoltIcon fontSize="large" color="warning" />, title: "Real-Time Updates", desc: "Live device status via WebSocket connection." },
  { icon: <SecurityIcon fontSize="large" color="success" />, title: "Secure Access", desc: "JWT-based authentication keeps your home safe." },
];

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "80vh",
          background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #1565c0 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          px: 3,
        }}
      >
        <HomeIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Smart Home Control
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.85, mb: 4, maxWidth: 600 }}>
          Manage your devices, monitor energy usage, and automate your home — all in one dashboard.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: "white", color: "#1a237e", fontWeight: "bold", "&:hover": { bgcolor: "#e3f2fd" } }}
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                size="large"
                sx={{ bgcolor: "white", color: "#1a237e", fontWeight: "bold", "&:hover": { bgcolor: "#e3f2fd" } }}
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ color: "white", borderColor: "white", "&:hover": { borderColor: "#90caf9" } }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, px: 4, bgcolor: "#f5f5f5" }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
          Why SmartHome?
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Paper elevation={2} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                {f.icon}
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>{f.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{f.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default LandingPage;
