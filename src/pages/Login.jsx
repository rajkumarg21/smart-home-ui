import { useState } from "react";
import {
  Box, TextField, Button, Typography, Paper,
  Alert, CircularProgress, Link
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    if (!data.username || !data.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await login(data.username, data.password);
      setUser({
        token: res.token,
        username: data.username,
        email: res.email || localStorage.getItem("email") || null,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e3f2fd, #f5f5f5)",
      }}
    >
      <Paper elevation={4} sx={{ p: 5, borderRadius: 4, width: "100%", maxWidth: 420 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <Box sx={{ bgcolor: "#1976d2", borderRadius: "50%", p: 1.5, mb: 1 }}>
            <LockOutlinedIcon sx={{ color: "white" }} />
          </Box>
          <Typography variant="h5" fontWeight="bold">Welcome Back</Typography>
          <Typography variant="body2" color="text.secondary">Sign in to your SmartHome account</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth label="Username" variant="outlined" margin="normal"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
          onKeyDown={handleKeyDown}
        />
        <TextField
          fullWidth label="Password" type="password" variant="outlined" margin="normal"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          onKeyDown={handleKeyDown}
        />

        <Button
          fullWidth variant="contained" size="large"
          sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.5 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        <Typography textAlign="center" variant="body2">
          Don't have an account?{" "}
          <Link href="/signup" underline="hover" fontWeight="bold">Sign Up</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
