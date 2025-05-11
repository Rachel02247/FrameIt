/* eslint-disable react-refresh/only-export-components */
// AIUnavailablePopupAuto.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import EmailIcon from "@mui/icons-material/Email";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";

export default () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 2000); // Show after 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setOpen(false);

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
        <PsychologyAltIcon sx={{ verticalAlign: "middle", mr: 1, color: "primary.main" }} />
        AI Features Coming Soon
      </DialogTitle>

      <DialogContent sx={{ px: 4 }}>
        <Typography variant="body1" sx={{ mb: 2, fontSize: "1rem", lineHeight: 1.8 }}>
          <FavoriteIcon sx={{ verticalAlign: "middle", mr: 1, color: "error.main" }} />
          We're working hard to bring you powerful and intuitive AI tools — crafted with you in mind.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontSize: "1rem", lineHeight: 1.8 }}>
          From smart filtering to stunning image transformations — exciting things are on the way.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1rem", lineHeight: 1.8 }}>
          <EmailIcon sx={{ verticalAlign: "middle", mr: 1, color: "secondary.main" }} />
          Questions or feedback? We’d love to hear from you. <br />
          <Link href="mailto:support@framelt.com" underline="hover" color="primary">
            support@framelt.com
          </Link>
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={handleClose} variant="contained" color="primary" sx={{ px: 4 }}>
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
