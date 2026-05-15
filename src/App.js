import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Automation from "./pages/Automation";
import UserProfile from "./pages/UserProfile";
import Devices from "./pages/Devices";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/devices" element={<Devices />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
