import {
  Box, Typography, Paper, Avatar, Divider,
  Chip, Button, Grid,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UserProfile() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();


  const initials = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  // Decode JWT to get any extra info (exp, iat, etc.)
  const getTokenInfo = () => {
    try {
      const token = user?.token;
      if (!token) {
        console.log("[UserProfile] No token found in user context");
        return null;
      }


      const parts = token.split(".");

      if (parts.length !== 3) {
        console.warn("[UserProfile] Token is not a valid JWT (expected 3 parts, got", parts.length, ")");
        return null;
      }

      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      console.log("[UserProfile] Full token payload:", payload);
      console.log("[UserProfile] username in token:", payload?.username ?? payload?.sub ?? "not found");
      console.log("[UserProfile] email in token:", payload?.email ?? "not found");
      return payload;
    } catch (err) {
      console.error("[UserProfile] Failed to decode token:", err);
      return null;
    }
  };

  const tokenInfo = getTokenInfo();
  const tokenExpiry = tokenInfo?.exp
    ? new Date(tokenInfo.exp * 1000).toLocaleString()
    : null;

  return (
    <Box
      sx={{
        minHeight: "90vh",
        background: "linear-gradient(135deg, #e3f2fd, #f5f5f5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        pt: 6,
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 560 }}>
        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, color: "#1a237e" }}
        >
          Back
        </Button>

        <Paper elevation={4} sx={{ borderRadius: 4, overflow: "hidden" }}>
          {/* Header banner */}
          <Box
            sx={{
              background: "linear-gradient(90deg, #1a237e, #0d47a1)",
              py: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#42a5f5",
                fontSize: 32,
                fontWeight: "bold",
                border: "3px solid rgba(255,255,255,0.7)",
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="h5" fontWeight="bold" color="white">
              {user?.username || "User"}
            </Typography>
            <Chip
              label="Active"
              size="small"
              sx={{ bgcolor: "#43a047", color: "white", fontWeight: "bold" }}
            />
          </Box>

          {/* Details */}
          <Box sx={{ p: 4 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight="bold"
              sx={{ letterSpacing: 1.5 }}
            >
              Account Details
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Username */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#f5f5f5",
                  }}
                >
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Username
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user?.username || "—"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#f5f5f5",
                  }}
                >
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user?.email || "Not provided"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Token expiry */}
              {tokenExpiry && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    <VpnKeyIcon color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Session Expires
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {tokenExpiry}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Button
              fullWidth
              variant="outlined"
              color="error"
              size="large"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderRadius: 2, py: 1.2 }}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default UserProfile;
