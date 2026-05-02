import { useEffect, useState } from "react";
import {
  Box, Typography, Grid, CircularProgress,
  Alert, Chip, Divider
} from "@mui/material";
import DeviceCard from "../components/DeviceCard";
import { getDevices } from "../services/deviceService";
import { connectSocket, disconnectSocket } from "../services/socket";

function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liveUpdate, setLiveUpdate] = useState(null);

  useEffect(() => {
    fetchDevices();

    // Connect WebSocket for real-time updates
    connectSocket((updatedDevice) => {
      setLiveUpdate(updatedDevice);
      setDevices((prev) =>
        prev.map((d) => (d.id === updatedDevice.id ? updatedDevice : d))
      );
    });

    return () => disconnectSocket();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.data);
    } catch (err) {
      setError("Failed to load devices. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceUpdate = (updated) => {
    setDevices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const onDevices = devices.filter((d) => d.status === "ON");
  const offDevices = devices.filter((d) => d.status === "OFF");

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">My Devices</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip label={`${onDevices.length} ON`} color="success" />
          <Chip label={`${offDevices.length} OFF`} color="default" />
        </Box>
      </Box>

      {liveUpdate && (
        <Alert severity="info" sx={{ mb: 2 }}>
          🔴 Live: <strong>{liveUpdate.name}</strong> is now <strong>{liveUpdate.status}</strong>
        </Alert>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : devices.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" mt={6}>
          No devices found. Add devices from your backend.
        </Typography>
      ) : (
        <>
          {onDevices.length > 0 && (
            <>
              <Typography variant="subtitle1" fontWeight="bold" color="success.main" sx={{ mb: 1 }}>
                Active Devices
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {onDevices.map((d) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={d.id}>
                    <DeviceCard device={d} onUpdate={handleDeviceUpdate} />
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ mb: 3 }} />
            </>
          )}

          {offDevices.length > 0 && (
            <>
              <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
                Inactive Devices
              </Typography>
              <Grid container spacing={3}>
                {offDevices.map((d) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={d.id}>
                    <DeviceCard device={d} onUpdate={handleDeviceUpdate} />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default Dashboard;
