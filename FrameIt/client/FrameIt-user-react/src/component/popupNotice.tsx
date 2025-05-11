/* eslint-disable react-refresh/only-export-components */
// PopupNotice.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export default () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>We're Building Something Great</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Our website is currently under active development. We’re working hard to create the best experience for you.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Everything we do is for your benefit — to simplify, to enhance, and to make things truly yours.
        </Typography>
        <Typography variant="body1">
          For any questions, feedback or requests, feel free to reach us at: <br />
          <strong>support@framelt.com</strong>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}
