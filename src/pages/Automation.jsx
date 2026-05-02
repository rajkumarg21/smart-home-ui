import { useState } from "react";
import {
  Box, Typography, Paper, Grid, Switch,
  FormControlLabel, TextField, Button, Chip, Divider, Alert
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

const mockRules = [
  { id: 1, name: "Morning Lights", trigger: "07:00 AM", action: "Turn ON LIGHT", active: true },
  { id: 2, name: "Night Mode", trigger: "10:00 PM", action: "Turn OFF all devices", active: true },
  { id: 3, name: "Away Mode", trigger: "Motion: None 30min", action: "Turn OFF AC + FAN", active: false },
];

function Automation() {
  const [rules, setRules] = useState(mockRules);
  const [newRule, setNewRule] = useState({ name: "", trigger: "", action: "" });
  const [saved, setSaved] = useState(false);

  const toggleRule = (id) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const addRule = () => {
    if (!newRule.name || !newRule.trigger || !newRule.action) return;
    setRules((prev) => [...prev, { ...newRule, id: Date.now(), active: true }]);
    setNewRule({ name: "", trigger: "", action: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <AutoFixHighIcon color="primary" />
        <Typography variant="h4" fontWeight="bold">Automation Rules</Typography>
      </Box>

      {saved && <Alert severity="success" sx={{ mb: 2 }}>Rule added successfully!</Alert>}

      {/* Existing Rules */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {rules.map((rule) => (
          <Grid item xs={12} sm={6} md={4} key={rule.id}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Typography fontWeight="bold">{rule.name}</Typography>
                <Chip
                  label={rule.active ? "Active" : "Paused"}
                  color={rule.active ? "success" : "default"}
                  size="small"
                />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <ScheduleIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">{rule.trigger}</Typography>
              </Box>
              <Typography variant="body2">⚡ {rule.action}</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={rule.active}
                    onChange={() => toggleRule(rule.id)}
                    color="success"
                  />
                }
                label={rule.active ? "Enabled" : "Disabled"}
                sx={{ mt: 1 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add New Rule */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, maxWidth: 600 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          + Add New Rule
        </Typography>
        <TextField
          fullWidth label="Rule Name" margin="normal" size="small"
          value={newRule.name}
          onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
        />
        <TextField
          fullWidth label="Trigger (e.g. 08:00 AM)" margin="normal" size="small"
          value={newRule.trigger}
          onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
        />
        <TextField
          fullWidth label="Action (e.g. Turn ON LIGHT)" margin="normal" size="small"
          value={newRule.action}
          onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
        />
        <Button
          variant="contained" sx={{ mt: 2 }}
          onClick={addRule}
          disabled={!newRule.name || !newRule.trigger || !newRule.action}
        >
          Add Rule
        </Button>
      </Paper>
    </Box>
  );
}

export default Automation;
