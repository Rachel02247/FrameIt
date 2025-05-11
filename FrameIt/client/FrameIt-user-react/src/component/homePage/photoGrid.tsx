import React, { useEffect, useState } from "react";
import { Grid, Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const imageUrls = [
  "https://images.pexels.com/photos/459972/pexels-photo-459972.jpeg",
  "https://images.pexels.com/photos/3661350/pexels-photo-3661350.jpeg",
  "https://images.pexels.com/photos/3770585/pexels-photo-3770585.jpeg",
  "https://images.pexels.com/photos/753451/pexels-photo-753451.jpeg",
  "https://images.pexels.com/photos/52571/baby-newborn-cute-boy-52571.jpeg",
  "https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg",
];

const shuffleArray = (array: string[]) => {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

const PhotoGrid: React.FC = () => {
  const [images, setImages] = useState<string[]>(imageUrls);
  const theme = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setImages((prev) => shuffleArray([...prev]));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ px: 3, py: 5 }}>
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
      >
        Recent Photos
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {images.map((url, index) => (
          <Grid item key={index} xs={6} sm={4} md={3} lg={2}>
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <img
                  src={url}
                  alt={`Photo ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PhotoGrid;
