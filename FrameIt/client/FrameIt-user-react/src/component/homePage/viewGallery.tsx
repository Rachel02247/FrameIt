import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const galleryImages = [
  "https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg",
  "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg",
  "https://images.pexels.com/photos/1648376/pexels-photo-1648376.jpeg",
  "https://images.pexels.com/photos/3662835/pexels-photo-3662835.jpeg",
];

const ViewGallery = () => {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        top: 10,
        position: "relative",
        zIndex: -1,
        px: 2,
        backgroundColor: "#e7e3f2", 
        overflow: "hidden",
      }}
    >
      <Grid container spacing={0} alignItems="center">
        {/* טקסט מיושר לימין בלי רקע */}
        <Grid item xs={12} md={6}>
          <Container sx={{ position: "relative", zIndex: 2 }}>
            <Box sx={{ textAlign: "right", pr: { xs: 0, md: 6 } }}>
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
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}
                >
                  Your Memories. <br /> One Place.
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
                  Dive into your private gallery –<br />
                  organized, beautiful and always accessible.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  component={Link}
                  to={sessionStorage.getItem("id") ? "myWorkspace/gallery" : "/login"}
                  sx={{ px: 4, borderRadius: 3 }}
                >
                  View Gallery
                </Button>
              </motion.div>
            </Box>
          </Container>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              height: { xs: "300px", md: "500px" },
              overflow: "hidden",
              position: "relative",
              borderRadius: "12px",
              boxShadow: "-10px 0 25px -10px rgba(0,0,0,0.1)",
            }}
          >
            <motion.img
              key={prevIndex}
              src={galleryImages[prevIndex]}
              alt="Previous"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                inset: 0,
              }}
            />
            <motion.img
              key={index}
              src={galleryImages[index]}
              alt="Current"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                inset: 0,
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewGallery;
