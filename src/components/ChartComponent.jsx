import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { Box, Typography } from "@mui/material";

function ChartComponent({ data, title, dataKey = "power", color = "#1976d2" }) {
  return (
    <Box sx={{ p: 2 }}>
      {title && (
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default ChartComponent;
