import { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Paper, Chip, Button, CircularProgress,
  Alert, Divider, LinearProgress, Tooltip, IconButton, Collapse,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import LockIcon from "@mui/icons-material/Lock";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getPredictions, applyPrediction } from "../services/deviceService";

const deviceIcon = (type) => {
  switch ((type || "").toUpperCase()) {
    case "LIGHT":  return <LightbulbIcon />;
    case "AC":     return <AcUnitIcon />;
    case "LOCK":   return <LockIcon />;
    case "CAMERA": return <CameraAltIcon />;
    default:       return <DevicesOtherIcon />;
  }
};

const actionColor = (action) =>
  action === "ON" ? "success" : "default";

function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  const color = pct >= 70 ? "#4caf50" : pct >= 40 ? "#ff9800" : "#f44336";
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
      <Box sx={{ flex: 1 }}>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "rgba(0,0,0,0.08)",
            "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ color, fontWeight: "bold", minWidth: 36 }}>
        {pct}%
      </Typography>
    </Box>
  );
}

function SuggestionCard({ suggestion, onApply, applied }) {
  return (
    <Paper
      elevation={suggestion.actionableNow ? 4 : 2}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: suggestion.actionableNow ? "2px solid #4caf50" : "1px solid rgba(0,0,0,0.08)",
        position: "relative",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 6 },
        opacity: applied ? 0.6 : 1,
      }}
    >
      {suggestion.actionableNow && (
        <Chip
          label="Now"
          size="small"
          color="success"
          icon={<AccessTimeIcon />}
          sx={{ position: "absolute", top: 12, right: 12, fontWeight: "bold" }}
        />
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: suggestion.suggestedAction === "ON" ? "success.light" : "grey.200",
            color: suggestion.suggestedAction === "ON" ? "success.dark" : "text.secondary",
            display: "flex",
          }}
        >
          {deviceIcon(suggestion.deviceType)}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {suggestion.deviceName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {suggestion.location || suggestion.deviceType}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Chip
          label={`Turn ${suggestion.suggestedAction}`}
          color={actionColor(suggestion.suggestedAction)}
          size="small"
          icon={<PowerSettingsNewIcon />}
        />
        <Chip
          label={suggestion.suggestedTimeLabel}
          size="small"
          variant="outlined"
          icon={<AccessTimeIcon />}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "0.8rem" }}>
        {suggestion.reason}
      </Typography>

      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary">
          Confidence
        </Typography>
        <ConfidenceBar value={suggestion.confidence} />
      </Box>

      {applied ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "success.main" }}>
          <CheckCircleIcon fontSize="small" />
          <Typography variant="body2" fontWeight="bold">Applied</Typography>
        </Box>
      ) : (
        <Button
          variant={suggestion.actionableNow ? "contained" : "outlined"}
          color={suggestion.suggestedAction === "ON" ? "success" : "inherit"}
          size="small"
          fullWidth
          startIcon={<AutoAwesomeIcon />}
          onClick={() => onApply(suggestion.deviceId, suggestion.suggestedAction)}
          sx={{ borderRadius: 2 }}
        >
          Apply Suggestion
        </Button>
      )}
    </Paper>
  );
}

function Predictions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(null);
  const [appliedSet, setAppliedSet] = useState(new Set());

  const fetchPredictions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getPredictions();
      setData(res.data?.data ?? res.data);
    } catch (err) {
      setError(err.response?.status === 401
        ? "Please log in to view predictions."
        : "Failed to load predictions. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const handleApply = async (deviceId, action) => {
    setApplying(`${deviceId}_${action}`);
    try {
      await applyPrediction(deviceId, action);
      setAppliedSet((prev) => new Set([...prev, `${deviceId}_${action}`]));
    } catch (err) {
      setError("Failed to apply suggestion. Please try again.");
    } finally {
      setApplying(null);
    }
  };

  const allSuggestions = data
    ? [...(data.currentSuggestions || []), ...(data.upcomingSuggestions || [])]
    : [];

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AutoAwesomeIcon sx={{ color: "primary.main", fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              AI Predictive Automation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Smart suggestions based on your daily usage patterns
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh predictions">
          <IconButton onClick={fetchPredictions} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats bar */}
      {data && (
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <Chip
            icon={<TrendingUpIcon />}
            label={`${data.totalEventsAnalyzed} events analyzed`}
            variant="outlined"
            color="primary"
          />
          <Chip
            label={`Last ${data.daysAnalyzed} days`}
            variant="outlined"
          />
          <Chip
            icon={<AutoAwesomeIcon />}
            label={`${allSuggestions.length} suggestions`}
            color="secondary"
            variant="outlined"
          />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : !data || allSuggestions.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center", borderRadius: 3 }}>
          <AutoAwesomeIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {data?.message || "No predictions available yet"}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Keep controlling your devices manually and the AI will learn your patterns.
            Predictions appear after at least 2 repeated actions at the same time.
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Message banner */}
          <Alert
            severity={data.currentSuggestions?.length > 0 ? "success" : "info"}
            icon={<AutoAwesomeIcon />}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {data.message}
          </Alert>

          {/* Current / Actionable Now */}
          {data.currentSuggestions?.length > 0 && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <AccessTimeIcon color="success" />
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  Right Now
                </Typography>
                <Chip label={data.currentSuggestions.length} color="success" size="small" />
              </Box>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {data.currentSuggestions.map((s) => (
                  <Grid item xs={12} sm={6} md={4} key={`${s.deviceId}_${s.suggestedAction}_${s.suggestedHour}`}>
                    <SuggestionCard
                      suggestion={s}
                      onApply={handleApply}
                      applied={appliedSet.has(`${s.deviceId}_${s.suggestedAction}`)}
                    />
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ mb: 3 }} />
            </>
          )}

          {/* Upcoming suggestions */}
          {data.upcomingSuggestions?.length > 0 && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Upcoming Today
                </Typography>
                <Chip label={data.upcomingSuggestions.length} color="primary" size="small" />
              </Box>
              <Grid container spacing={2}>
                {data.upcomingSuggestions.map((s) => (
                  <Grid item xs={12} sm={6} md={4} key={`${s.deviceId}_${s.suggestedAction}_${s.suggestedHour}`}>
                    <SuggestionCard
                      suggestion={s}
                      onApply={handleApply}
                      applied={appliedSet.has(`${s.deviceId}_${s.suggestedAction}`)}
                    />
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

export default Predictions;
