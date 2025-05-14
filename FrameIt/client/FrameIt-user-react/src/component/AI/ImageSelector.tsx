"use client"

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import type { RootState, AppDispatch } from "../global-states/store";
import { fetchFilesByUserId } from "../global-states/fileSlice";

interface ImageSelectorProps {
  selectedImage: string | null;
  onSelect: (imageId: string) => void;
}

export function ImageSelector({ selectedImage, onSelect }: ImageSelectorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const files = useSelector((state: RootState) => state.files.files);
  const loading = useSelector((state: RootState) => state.files.loading);

  useEffect(() => {
    dispatch(fetchFilesByUserId(1)); // Replace 1 with the actual user ID
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (files.length === 0) {
    return <Box sx={{ p: 3 }}>No images found in your gallery. Please upload some images first.</Box>;
  }

  return (
    <Box sx={{ maxHeight: "400px", overflowY: "auto", p: 1 }}>
      <Grid container spacing={2}>
        {files.map((file) => (
          <Grid item xs={6} sm={4} key={file.id}>
            <Box
              sx={{
                position: "relative",
                paddingTop: "100%", // 1:1 Aspect Ratio
                cursor: "pointer",
                borderRadius: 1,
                overflow: "hidden",
                border: 2,
                borderColor: selectedImage === file.id ? "primary.main" : "transparent",
                "&:hover": {
                  borderColor: selectedImage === file.id ? "primary.main" : "grey.300",
                },
                transition: "all 0.2s",
                backgroundColor: "grey.200", // Placeholder background
              }}
              onClick={() => onSelect(file.id)}
            >
              <img
                src={file.downloadUrl || "/placeholder.svg"} // Use placeholder if downloadUrl is not ready
                alt={file.fileName || "Image"}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
