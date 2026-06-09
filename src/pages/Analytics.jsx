import { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Paper, CircularProgress,
  Alert, Select, MenuItem, FormControl, InputLabel,
  Button, Chip, Stack
} from "@mui/material";
import ChartComponent from "../components/ChartComponent";
import { getDevices, getDeviceAnalytics, generateAiUsageReport } from "../services/deviceService";
import { connectNotificationSocket, disconnectNotificationSocket } from "../services/socket";

function Analytics() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportPeriod, setReportPeriod] = useState("TODAY");
  const [usageReport, setUsageReport] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDevices()
      .then((res) => {
        const data = res.data?.data ?? res.data;
        const list = Array.isArray(data) ? data : [];
        setDevices(list);
        if (list.length > 0) setSelectedDevice(list[0].id);
      })
      .catch(() => setError("Failed to load devices."));
  }, []);

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    connectNotificationSocket(username, (message) => {
      if (message.type === "AI_USAGE_REPORT") {
        setNotification(message);
        setUsageReport(message.report);
      }
    });

    return () => disconnectNotificationSocket();
  }, []);

  useEffect(() => {
    if (!selectedDevice) return;
    setLoading(true);
    getDeviceAnalytics(selectedDevice)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setChartData(Array.isArray(data) ? data : []);
      })
      .catch(() => setError("Failed to load analytics data."))
      .finally(() => setLoading(false));
  }, [selectedDevice]);

  const handleGenerateReport = async () => {
    setReportLoading(true);
    setError("");
    try {
      const res = await generateAiUsageReport(reportPeriod, true);
      const data = res.data?.data ?? res.data;
      setUsageReport(data);
      setNotification(null);
    } catch (err) {
      setError("Failed to generate AI usage report.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Analytics
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {notification && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {notification.title}: {notification.message}
        </Alert>
      )}

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 4 }} alignItems={{ md: "center" }}>
        <FormControl sx={{ minWidth: 240 }}>
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

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Report Period</InputLabel>
          <Select
            value={reportPeriod}
            label="Report Period"
            onChange={(e) => setReportPeriod(e.target.value)}
          >
            <MenuItem value="TODAY">Today</MenuItem>
            <MenuItem value="LAST_1_WEEK">Last 1 week</MenuItem>
            <MenuItem value="LAST_1_MONTH">Last 1 month</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleGenerateReport}
          disabled={reportLoading}
          sx={{ minHeight: 54 }}
        >
          {reportLoading ? "Generating..." : "Generate AI Report"}
        </Button>
      </Stack>

      {usageReport && (
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mb: 2 }}>
            <Chip label={usageReport.period} color="primary" />
            <Chip label={`${usageReport.totalRuntimeMinutes ?? 0} min runtime`} />
            <Chip label={`${usageReport.totalEnergyKwh ?? 0} kWh`} />
            <Chip label={`${usageReport.activeDevices ?? 0}/${usageReport.totalDevices ?? 0} active`} />
          </Stack>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            AI Usage Report
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {usageReport.report}
          </Typography>
          {Array.isArray(usageReport.deviceSummaries) && usageReport.deviceSummaries.length > 0 && (
            <Grid container spacing={2}>
              {usageReport.deviceSummaries.slice(0, 4).map((device) => (
                <Grid item xs={12} sm={6} md={3} key={device.deviceId}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography fontWeight="bold">{device.deviceName}</Typography>
                    <Typography variant="body2" color="text.secondary">{device.deviceType}</Typography>
                    <Typography variant="body2">{device.runtimeMinutes} min</Typography>
                    <Typography variant="body2">{device.energyKwh} kWh</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

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
