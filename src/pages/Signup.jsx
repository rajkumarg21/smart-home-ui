import { useState } from "react";
import {
  Box, TextField, Button, Typography, Paper,
  Alert, CircularProgress, Link
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";

function Signup() {
  const [data, setData] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!data.username || !data.email || !data.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (data.password !== data.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signup(data.username, data.password, data.email);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e8f5e9, #f5f5f5)",
      }}
    >
      <Paper elevation={4} sx={{ p: 5, borderRadius: 4, width: "100%", maxWidth: 420 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <Box sx={{ bgcolor: "#388e3c", borderRadius: "50%", p: 1.5, mb: 1 }}>
            <PersonAddIcon sx={{ color: "white" }} />
          </Box>
          <Typography variant="h5" fontWeight="bold">Create Account</Typography>
          <Typography variant="body2" color="text.secondary">Join SmartHome today</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField fullWidth label="Username" variant="outlined" margin="normal"
          value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} />
        <TextField fullWidth label="Email" type="email" variant="outlined" margin="normal"
          value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
        <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal"
          value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
        <TextField fullWidth label="Confirm Password" type="password" variant="outlined" margin="normal"
          value={data.confirm} onChange={(e) => setData({ ...data, confirm: e.target.value })} />

        <Button
          fullWidth variant="contained" color="success" size="large"
          sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.5 }}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
        </Button>

        <Typography textAlign="center" variant="body2">
          Already have an account?{" "}
          <Link href="/login" underline="hover" fontWeight="bold">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Signup;
