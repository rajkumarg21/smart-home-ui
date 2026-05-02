import { useState } from "react";
import {
  Card, CardContent, CardActions, Typography, Button,
  Chip, Box, Slider, Switch, FormControlLabel
} from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import TvIcon from "@mui/icons-material/Tv";
import ToysIcon from "@mui/icons-material/Toys";
import DevicesIcon from "@mui/icons-material/Devices";
import { controlDevice } from "../services/deviceService";

const deviceIcons = {
  LIGHT: <LightbulbIcon fontSize="large" />,
  AC: <AcUnitIcon fontSize="large" />,
  TV: <TvIcon fontSize="large" />,
  FAN: <ToysIcon fontSize="large" />,
};

function DeviceCard({ device, onUpdate }) {
  const [status, setStatus] = useState(device.status);
  const [speed, setSpeed] = useState(device.speed || 1);
  const [loading, setLoading] = useState(false);

  const toggleDevice = async () => {
    setLoading(true);
    try {
      const newStatus = status === "ON" ? "OFF" : "ON";
      await controlDevice(device.id, newStatus);
      setStatus(newStatus);
      if (onUpdate) onUpdate({ ...device, status: newStatus });
    } catch (err) {
      console.error("Failed to toggle device:", err);
    } finally {
      setLoading(false);
    }
  };

  const isOn = status === "ON";

  return (
    <Card
      sx={{
        minWidth: 220,
        borderRadius: 3,
        boxShadow: isOn ? "0 4px 20px rgba(25, 118, 210, 0.4)" : "0 2px 8px rgba(0,0,0,0.1)",
        border: isOn ? "1px solid #1976d2" : "1px solid #e0e0e0",
        transition: "all 0.3s ease",
        background: isOn ? "linear-gradient(135deg, #e3f2fd, #ffffff)" : "#fafafa",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Box sx={{ color: isOn ? "#1976d2" : "#9e9e9e" }}>
            {deviceIcons[device.type] || <DevicesIcon fontSize="large" />}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">{device.name}</Typography>
            <Typography variant="caption" color="text.secondary">{device.type}</Typography>
          </Box>
        </Box>

        <Chip
          label={status}
          color={isOn ? "success" : "default"}
          size="small"
          sx={{ mb: 1 }}
        />

        {device.type === "FAN" && isOn && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption">Speed: {speed}</Typography>
            <Slider
              value={speed}
              min={1}
              max={5}
              step={1}
              marks
              onChange={(_, val) => setSpeed(val)}
              size="small"
            />
          </Box>
        )}

        {device.location && (
          <Typography variant="caption" color="text.secondary" display="block">
            📍 {device.location}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <Button
          fullWidth
          variant={isOn ? "outlined" : "contained"}
          color={isOn ? "error" : "primary"}
          onClick={toggleDevice}
          disabled={loading}
          size="small"
        >
          {loading ? "..." : isOn ? "Turn OFF" : "Turn ON"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default DeviceCard;
