import { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Paper, CircularProgress,
  Alert, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import ChartComponent from "../components/ChartComponent";
import { getDevices, getDeviceAnalytics } from "../services/deviceService";

function Analytics() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getDevices()
      .then((res) => {
        setDevices(res.data);
        if (res.data.length > 0) setSelectedDevice(res.data[0].id);
      })
      .catch(() => setError("Failed to load devices."));
  }, []);

  useEffect(() => {
    if (!selectedDevice) return;
    setLoading(true);
    getDeviceAnalytics(selectedDevice)
      .then((res) => setChartData(res.data))
      .catch(() => setError("Failed to load analytics data."))
      .finally(() => setLoading(false));
  }, [selectedDevice]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Analytics
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormControl sx={{ mb: 4, minWidth: 240 }}>
        <InputLabel>Select Device</InputLabel>
        <Select
          value={selectedDevice}
          label="Select Device"
          onChange={(e) => setSelectedDevice(e.target.value)}
        >
          {devices.map((d) => (
            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ borderRadius: 3 }}>
              <ChartComponent
                data={chartData}
                title="Power Consumption (W)"
                dataKey="power"
                color="#1976d2"
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ borderRadius: 3 }}>
              <ChartComponent
                data={chartData}
                title="Usage Duration (min)"
                dataKey="duration"
                color="#388e3c"
              />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Analytics;
