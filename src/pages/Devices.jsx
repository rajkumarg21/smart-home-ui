import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Paper, Grid, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, IconButton, CircularProgress,
  Alert, Tooltip, Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import LockIcon from "@mui/icons-material/Lock";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import { getDevices, addDevice, deleteDevice, controlDevice } from "../services/deviceService";

const DEVICE_TYPES = ["LIGHT", "FAN", "AC", "LOCK", "CAMERA", "OTHER"];

const deviceIcon = (type) => {
  switch (type) {
    case "LIGHT":  return <LightbulbIcon />;
    case "AC":     return <AcUnitIcon />;
    case "LOCK":   return <LockIcon />;
    case "CAMERA": return <CameraAltIcon />;
    default:       return <DevicesOtherIcon />;
  }
};

const emptyForm = { name: "", type: "LIGHT", location: "", metadata: "" };

function Devices() {
  const [devices, setDevices]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving]       = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchDevices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDevices();
      // Handle ApiResponse wrapper
      const data = res.data?.data ?? res.data;
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load devices. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDevices(); }, []);

  const handleOpenDialog = () => {
    setForm(emptyForm);
    setFormError("");
    setDialogOpen(true);
  };

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddDevice = async () => {
    if (!form.name.trim()) { setFormError("Device name is required."); return; }
    if (!form.type)        { setFormError("Device type is required."); return; }
    setSaving(true);
    setFormError("");
    try {
      await addDevice(form);
      setDialogOpen(false);
      fetchDevices();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add device.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDevice(id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError("Failed to delete device.");
    }
  };

  const handleToggle = async (device) => {
    setTogglingId(device.id);
    const action = device.status === "ON" ? "OFF" : "ON";
    try {
      await controlDevice(device.id, action);
      setDevices((prev) =>
        prev.map((d) => d.id === device.id ? { ...d, status: action } : d)
      );
    } catch {
      setError("Failed to toggle device.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <Box sx={{ minHeight: "90vh", background: "linear-gradient(135deg, #e3f2fd, #f5f5f5)", p: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#1a237e">
            Devices
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and control your smart home devices
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: 2, px: 3, background: "linear-gradient(90deg, #1a237e, #0d47a1)" }}
        >
          Add Device
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>{error}</Alert>}

      {/* Device list */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : devices.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <DevicesOtherIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">No devices added yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Click "Add Device" to register your first smart device
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenDialog}>
            Add Device
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {devices.map((device) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={device.id}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                }}
              >
                {/* Card top color bar based on status */}
                <Box
                  sx={{
                    height: 6,
                    background: device.status === "ON"
                      ? "linear-gradient(90deg, #43a047, #66bb6a)"
                      : "linear-gradient(90deg, #757575, #9e9e9e)",
                  }}
                />

                <Box sx={{ p: 2.5 }}>
                  {/* Icon + name row */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        bgcolor: device.status === "ON" ? "#e8f5e9" : "#f5f5f5",
                        color: device.status === "ON" ? "#43a047" : "#757575",
                        borderRadius: 2,
                        p: 1,
                        display: "flex",
                      }}
                    >
                      {deviceIcon(device.type)}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {device.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {device.location || "No location"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                    <Chip label={device.type} size="small" variant="outlined" />
                    <Chip
                      label={device.status}
                      size="small"
                      sx={{
                        bgcolor: device.status === "ON" ? "#e8f5e9" : "#fafafa",
                        color: device.status === "ON" ? "#2e7d32" : "#616161",
                        fontWeight: "bold",
                        border: "1px solid",
                        borderColor: device.status === "ON" ? "#a5d6a7" : "#e0e0e0",
                      }}
                    />
                  </Box>

                  {device.metadata && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                      {device.metadata}
                    </Typography>
                  )}

                  <Divider sx={{ mb: 1.5 }} />

                  {/* Actions */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Tooltip title={device.status === "ON" ? "Turn Off" : "Turn On"}>
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleToggle(device)}
                          disabled={togglingId === device.id}
                          sx={{
                            color: device.status === "ON" ? "#43a047" : "#757575",
                            "&:hover": { bgcolor: device.status === "ON" ? "#e8f5e9" : "#f5f5f5" },
                          }}
                        >
                          {togglingId === device.id
                            ? <CircularProgress size={18} />
                            : <PowerSettingsNewIcon />}
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Delete device">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(device.id)}
                        sx={{ color: "#ef5350", "&:hover": { bgcolor: "#ffebee" } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Device Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>Add New Device</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <TextField
            fullWidth label="Device Name" name="name"
            value={form.name} onChange={handleFormChange}
            margin="normal" required
            placeholder="e.g. Living Room Light"
          />

          <TextField
            fullWidth select label="Device Type" name="type"
            value={form.type} onChange={handleFormChange}
            margin="normal" required
          >
            {DEVICE_TYPES.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth label="Location" name="location"
            value={form.location} onChange={handleFormChange}
            margin="normal"
            placeholder="e.g. Living Room, Bedroom"
          />

          <TextField
            fullWidth label="Metadata (optional)" name="metadata"
            value={form.metadata} onChange={handleFormChange}
            margin="normal"
            placeholder="e.g. brightness=80, temp=22"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
          <Button
            variant="contained" onClick={handleAddDevice} disabled={saving}
            sx={{ borderRadius: 2, px: 3, background: "linear-gradient(90deg, #1a237e, #0d47a1)" }}
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : "Add Device"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Devices;
