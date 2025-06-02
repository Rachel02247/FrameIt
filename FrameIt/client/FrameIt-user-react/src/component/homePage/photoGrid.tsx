/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Grid, Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../component/global-states/store";
import { fetchFilesByUserId } from "../../component/global-states/fileSlice";

const imageUrls = [
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
  const [userFilesImages, setUserFilesImages] = useState<string[]>([]);
  const theme = useTheme();
  const { language } = useLanguage();

  // Redux selectors
  const user = useSelector((state: RootState) => state.user.user);
  const token = sessionStorage.getItem('token');
  const files = useSelector((state: RootState) => state.files.files);
  const dispatch = useDispatch<AppDispatch>();

  const translations = {
    en: {
      title: "Recent Photos",
    },
    he: {
      title: "תמונות אחרונות",
    },
  };

  const t = translations[language];

  useEffect(() => {
    let isMounted = true;

    const fetchUserImages = async () => {
      if (user?.id || token) {
        await dispatch(fetchFilesByUserId(Number(user.id)));

        if (files && files.length > 0) {
          const sortedFiles = [...files]
            .filter((f) => !!f.s3Key) 
            .sort((a, b) => Number(b.id) - Number(a.id))
            .slice(0, 6); 

          const urls = sortedFiles.map((file) => file.downloadUrl || "");
          // Prevent duplicates
          if (isMounted) setUserFilesImages(Array.from(new Set(urls)));
        } else {
          setUserFilesImages([]);
        }
      }
    };

    fetchUserImages();
    return () => {
      isMounted = false;
    };
  }, [user, files, dispatch]);

  // Shuffle images every 6 seconds (only for default images)
  useEffect(() => {
    if (!user) {
      const interval = setInterval(() => {
        setImages((prev) => shuffleArray([...prev]));
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const isConnected = !!(user?.id && user?.id !== "0") || !!token;
  const imagesToShow =
    isConnected && userFilesImages.length > 0
      ? userFilesImages
      : images;

  return (
    <Box
      sx={{
        px: 3,
        py: 5,
        direction: language === "he" ? "rtl" : "ltr",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
      >
        {t.title}
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {imagesToShow.map((url, index) => (
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
                  loading="lazy"
                  onError={e => { e.currentTarget.src = "/fallback-image.png"; }}
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