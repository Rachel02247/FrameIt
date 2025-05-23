// PopupNotice.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,

} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";

export default function PopupNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
        sx: {
          borderRadius: 4,
          padding: 2,
          textAlign: "center",
        },
      }}
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <img src="/img/logo.png" alt="FramelT Logo" style={{ height: 60 }} />
      </Box>

      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        <InfoIcon sx={{ verticalAlign: "middle", mr: 1, color: "primary.main" }} />
        We're Still Crafting Your Experience
      </DialogTitle>

      <DialogContent sx={{ px: 4 }}>
        <Typography variant="body1" sx={{ mb: 2, fontSize: "1rem", lineHeight: 1.8 }}>
          <FavoriteIcon sx={{ verticalAlign: "middle", mr: 1, color: "error.main" }} />
          <strong>This website is still under development,</strong> but every feature is built
          thoughtfully with <strong>you</strong> in mind.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontSize: "1rem", lineHeight: 1.8 }}>
          We're here to provide a smooth, creative, and joyful experience —
          because your journey deserves the best.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1rem", lineHeight: 1.8 }}>
          <EmailIcon sx={{ verticalAlign: "middle", mr: 1, color: "secondary.main" }} />
          Have questions or feedback?
          <br />
          <strong>We’re listening.</strong> Reach us at: <br />
      <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=frameit.noreply@gmail.com&su=Contact%20regarding%20FramelT%20website&body=Hello,%20I%20would%20like%20to%20contact%20regarding%20the%20FramelT%20"
  target="_blank"
  rel="noopener noreferrer"
  style={{ color: '#0077cc', textDecoration: 'none', marginLeft: '5px' }}
>
  support@frameit.com
</a>
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={handleClose} variant="contained" color="primary" sx={{ px: 4 }}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
