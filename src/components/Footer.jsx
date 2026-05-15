import {
  Box, Typography, Grid, Link, IconButton, Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import { useNavigate } from "react-router-dom";

const socialLinks = [
  {
    icon: <InstagramIcon />,
    label: "Instagram",
    href: "https://instagram.com",
    color: "#E1306C",
  },
  {
    icon: <XIcon />,
    label: "X",
    href: "https://x.com",
    color: "#000000",
  },
  {
    icon: <YouTubeIcon />,
    label: "YouTube",
    href: "https://youtube.com",
    color: "#FF0000",
  },
  {
    icon: <FacebookIcon />,
    label: "Facebook",
    href: "https://facebook.com",
    color: "#1877F2",
  },
];

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Analytics", path: "/analytics" },
  { label: "Automation", path: "/automation" },
  { label: "Devices", path: "/devices" },
];

const infoLinks = [
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", path: "/terms" },
];

function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(90deg, #1a237e, #0d47a1)",
        color: "white",
        pt: 6,
        pb: 3,
        px: { xs: 3, md: 8 },
        mt: "auto",
      }}
    >
      <Grid container spacing={4}>
        {/* Brand */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <HomeIcon />
            <Typography variant="h6" fontWeight="bold">
              RK Home Automation
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.75, lineHeight: 1.8 }}>
            Smart living made simple. Control, monitor, and automate your home
            from anywhere, anytime.
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, letterSpacing: 1 }}>
            QUICK LINKS
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                component="button"
                underline="hover"
                onClick={() => navigate(link.path)}
                sx={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 14,
                  textAlign: "left",
                  cursor: "pointer",
                  "&:hover": { color: "white" },
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Grid>

        {/* Info Links */}
        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, letterSpacing: 1 }}>
            COMPANY
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
            {infoLinks.map((link) => (
              <Link
                key={link.label}
                component="button"
                underline="hover"
                onClick={() => navigate(link.path)}
                sx={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 14,
                  textAlign: "left",
                  cursor: "pointer",
                  "&:hover": { color: "white" },
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Grid>

        {/* Contact + Social */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, letterSpacing: 1 }}>
            CONTACT
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75, mb: 0.5 }}>
            📧 support@rkhomeautomation.com
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75, mb: 2 }}>
            📞 +91 98765 43210
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, letterSpacing: 1 }}>
            FOLLOW US
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {socialLinks.map((s) => (
              <IconButton
                key={s.label}
                component="a"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                size="small"
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: s.color, transform: "translateY(-2px)" },
                  transition: "all 0.2s",
                }}
              >
                {s.icon}
              </IconButton>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", my: 3 }} />

      {/* Bottom bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.65, textAlign: "center" }}>
          © {year} RK Home Automation Solution. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.65, textAlign: "center" }}>
          ™ RK Home Automation Solution is a registered trademark.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;
