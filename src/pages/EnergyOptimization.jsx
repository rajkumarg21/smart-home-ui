import { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Paper, Chip, CircularProgress, Alert,
  Select, MenuItem, FormControl, InputLabel, TextField, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, Tooltip, IconButton, Card, CardContent,
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import BoltIcon from "@mui/icons-material/Bolt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Co2Icon from "@mui/icons-material/Co2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { getEnergyReport } from "../services/deviceService";

const PERIOD_OPTIONS = [
  { value: "TODAY", label: "Today" },
  { value: "LAST_7_DAYS", label: "Last 7 Days" },
  { value: "LAST_30_DAYS", label: "Last 30 Days" },
];

const PIE_COLORS = [
  "#1976d2", "#4caf50", "#ff9800", "#e91e63",
  "#9c27b0", "#00bcd4", "#ff5722", "#607d8b",
];

function StatCard({ icon, label, value, sub, color = "primary.main", bgcolor = "primary.light" }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor, color, display: "flex" }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="h5" fontWeight="bold" color={color}>{value}</Typography>
            {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function ShareBar({ value, color }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ flex: 1 }}>
        <LinearProgress
          variant="determinate"
          value={Math.min(value, 100)}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "rgba(0,0,0,0.06)",
            "& .MuiLinearProgress-bar": { bgcolor: color || "#1976d2", borderRadius: 4 },
          }}
        />
      </Box>
      <Typography variant="caption" fontWeight="bold" sx={{ minWidth: 38 }}>
        {value.toFixed(1)}%
      </Typography>
    </Box>
  );
}

function EnergyOptimization() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("TODAY");
  const [tariff, setTariff] = useState("10");

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getEnergyReport(period, parseFloat(tariff) || 10);
      setReport(res.data?.data ?? res.data);
    } catch (err) {
      setError(err.response?.status === 401
        ? "Please log in to view energy data."
        : "Failed to load energy report. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const pieData = report?.devices?.map((d) => ({
    name: d.deviceName,
    value: d.energyKwh,
  })) || [];

  const barData = report?.devices?.map((d) => ({
    name: d.deviceName.length > 10 ? d.deviceName.slice(0, 10) + "…" : d.deviceName,
    kWh: d.energyKwh,
    cost: d.costInr,
    runtime: parseFloat((d.runtimeMinutes / 60).toFixed(1)),
  })) || [];

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <BoltIcon sx={{ color: "#ff9800", fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Smart Energy Optimization
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Device-wise consumption · Bill prediction · AI suggestions · Carbon footprint
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh report">
          <IconButton onClick={fetchReport} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Controls */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Period</InputLabel>
          <Select value={period} label="Period" onChange={(e) => setPeriod(e.target.value)}>
            {PERIOD_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="Tariff (₹/kWh)"
          type="number"
          value={tariff}
          onChange={(e) => setTariff(e.target.value)}
          onBlur={fetchReport}
          sx={{ width: 140 }}
          inputProps={{ min: 1, max: 50, step: 0.5 }}
        />
        <Chip
          label={`Emission: 0.82 kg CO₂/kWh`}
          variant="outlined"
          size="small"
          icon={<Co2Icon />}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : !report ? null : (
        <>
          {/* ── Summary Cards ─────────────────────────────────────────────── */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <StatCard
                icon={<BoltIcon />}
                label="Total Energy"
                value={`${report.totalEnergyKwh} kWh`}
                sub={`${report.period}`}
                color="#1976d2"
                bgcolor="#e3f2fd"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                icon={<AttachMoneyIcon />}
                label="Total Cost"
                value={`₹${report.totalCostInr}`}
                sub={`@ ₹${report.tariffPerKwh}/kWh`}
                color="#2e7d32"
                bgcolor="#e8f5e9"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                icon={<TrendingUpIcon />}
                label="Monthly Bill (est.)"
                value={`₹${report.projectedMonthlyBillInr}`}
                sub={`${report.projectedMonthlyKwh} kWh/month`}
                color="#e65100"
                bgcolor="#fff3e0"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                icon={<Co2Icon />}
                label="Carbon Footprint"
                value={`${report.totalCarbonKg} kg`}
                sub="CO₂ equivalent"
                color="#6a1b9a"
                bgcolor="#f3e5f5"
              />
            </Grid>
          </Grid>

          {/* ── Peak Load + Savings ───────────────────────────────────────── */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <WarningAmberIcon sx={{ color: "#ff9800" }} />
                  <Typography variant="subtitle1" fontWeight="bold">Peak Load Detection</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Highest consumption hour
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="#ff9800">
                    {report.peakLoadHourLabel}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({report.peakLoadKwh} kWh)
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Shift heavy appliances to off-peak hours to reduce load
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, height: "100%", bgcolor: "#e8f5e9" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <LightbulbIcon sx={{ color: "#2e7d32" }} />
                  <Typography variant="subtitle1" fontWeight="bold" color="#2e7d32">
                    Potential Savings
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  With AI optimization (est. 20%)
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="#2e7d32">
                    ₹{report.potentialSavingsInr}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / {report.potentialSavingsKwh} kWh saved
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Follow the AI suggestions below to achieve this
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* ── Device Table ──────────────────────────────────────────────── */}
          {report.devices?.length > 0 && (
            <Paper elevation={2} sx={{ borderRadius: 3, mb: 3, overflow: "hidden" }}>
              <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Device-wise Consumption
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell><b>Device</b></TableCell>
                      <TableCell><b>Type</b></TableCell>
                      <TableCell align="right"><b>Runtime (h)</b></TableCell>
                      <TableCell align="right"><b>Energy (kWh)</b></TableCell>
                      <TableCell align="right"><b>Cost (₹)</b></TableCell>
                      <TableCell align="right"><b>CO₂ (kg)</b></TableCell>
                      <TableCell sx={{ minWidth: 140 }}><b>Share</b></TableCell>
                      <TableCell><b>Tip</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.devices.map((d, i) => (
                      <TableRow
                        key={d.deviceId}
                        sx={{
                          bgcolor: d.peakContributor ? "rgba(255,152,0,0.06)" : "inherit",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.03)" },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            {d.peakContributor && (
                              <Tooltip title="Peak load contributor">
                                <WarningAmberIcon sx={{ fontSize: 14, color: "#ff9800" }} />
                              </Tooltip>
                            )}
                            <Typography variant="body2" fontWeight={d.peakContributor ? "bold" : "normal"}>
                              {d.deviceName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={d.deviceType} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">
                          {(d.runtimeMinutes / 60).toFixed(1)}h
                        </TableCell>
                        <TableCell align="right">
                          <b>{d.energyKwh}</b>
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#2e7d32", fontWeight: "bold" }}>
                          ₹{d.costInr}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#6a1b9a" }}>
                          {d.carbonKg}
                        </TableCell>
                        <TableCell sx={{ minWidth: 140 }}>
                          <ShareBar value={d.sharePercent} color={PIE_COLORS[i % PIE_COLORS.length]} />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={d.optimizationTip}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                maxWidth: 200,
                              }}
                            >
                              {d.optimizationTip}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* ── Charts ───────────────────────────────────────────────────── */}
          {barData.length > 0 && (
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={7}>
                <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                    Energy & Cost by Device
                  </Typography>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                      <RechartTooltip
                        formatter={(value, name) => {
                          if (name === "kWh") return [`${value} kWh`, "Energy"];
                          if (name === "cost") return [`₹${value}`, "Cost"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="kWh" fill="#1976d2" radius={[4, 4, 0, 0]} name="kWh" />
                      <Bar yAxisId="right" dataKey="cost" fill="#4caf50" radius={[4, 4, 0, 0]} name="cost" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                    Consumption Share
                  </Typography>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) =>
                          percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
                        }
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend
                        formatter={(value) =>
                          value.length > 12 ? value.slice(0, 12) + "…" : value
                        }
                      />
                      <RechartTooltip
                        formatter={(value) => [`${value} kWh`, "Energy"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* ── AI Optimization Suggestions ──────────────────────────────── */}
          {report.optimizationSuggestions?.length > 0 && (
            <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <LightbulbIcon sx={{ color: "#ff9800" }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  AI Optimization Suggestions
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {report.optimizationSuggestions.map((tip, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: i === 0 ? "rgba(255,152,0,0.08)" : "rgba(0,0,0,0.03)",
                      borderLeft: `4px solid ${i === 0 ? "#ff9800" : "#1976d2"}`,
                    }}
                  >
                    <Typography variant="body2">{tip}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}

export default EnergyOptimization;
