import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PhotoLibrary,
  CloudUpload,
  Collections,
  Brush,
  SmartToy,
} from "@mui/icons-material";

const Hero = () => {
  const features = [
    { icon: <PhotoLibrary fontSize="large" color="primary" />, text: "My Gallery" },
    { icon: <CloudUpload fontSize="large" color="primary" />, text: "Easy Upload" },
    { icon: <Collections fontSize="large" color="primary" />, text: "Choose Collections" },
    { icon: <Brush fontSize="large" color="primary" />, text: "Collage Maker" },
    { icon: <SmartToy fontSize="large" color="primary" />, text: "AI Features" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src="/img/logo.png"
            alt="FrameIt Logo"
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              marginBottom: 24,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              mb: 1,
              letterSpacing: 1,
            }}
          >
            FrameIt
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 4,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            Your smart photo world in one place. Organized, personal and AI-powered.
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 4,
            mb: 6,
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: 100,
              }}
            >
              {feature.icon}
              <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                {feature.text}
              </Typography>
            </motion.div>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              component={Link}
              to={sessionStorage.getItem("id") ? "myWorkspace/gallery" : "/login"}
              variant="outlined"
              color="primary"
              size="large"
              sx={{ borderRadius: 6, px: 4 }}
            >
              My Gallery
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/register"
              sx={{ borderRadius: 6, px: 4 }}
            >
              Get Started
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
