import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ViewGallery = () => {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "85vh",
        top: 10,
        zIndex: -1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #d8d5e3, #f0eef5)",
        overflow: "hidden",
        px: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("https://www.transparenttextures.com/patterns/wavecut.png")`,
          opacity: 0.3,
          backgroundRepeat: "repeat",
          backgroundSize: "170px 150px",
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Box sx={{ mb: 3 }}>
            <img
              src="/img/logo.png"
              alt="FramelT Logo"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            />
          </Box>

          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
            Your Memories. One Place.
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
            Dive into your private gallery – organized, beautiful and always accessible.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            component={Link}
            to={sessionStorage.getItem("id") ? "myWorkspace/gallery" : "/login"}
            sx={{ px: 4, borderRadius: 8 }}
          >
            View Gallery
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ViewGallery;
