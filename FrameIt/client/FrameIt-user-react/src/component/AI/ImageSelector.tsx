"use client"

import { Box, Grid } from "@mui/material"

interface ImageSelectorProps {
  selectedImage: string | null
  onSelect: (imageId: string) => void
  images: { id: string; src: string; alt: string }[]
}

export function ImageSelector({ selectedImage, onSelect, images }: ImageSelectorProps) {
  if (images.length === 0) {
    return <Box sx={{ p: 3 }}>No images found in your gallery. Please upload some images first.</Box>
  }

  return (
    <Box sx={{ maxHeight: "400px", overflowY: "auto", p: 1 }}>
      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid item xs={6} sm={4} key={image.id}>
            <Box
              sx={{
                position: "relative",
                paddingTop: "100%",
                cursor: "pointer",
                borderRadius: 1,
                overflow: "hidden",
                border: 6,
                borderColor: selectedImage === image.id ? "primary.main" : "transparent",
                "&:hover": {
                  borderColor: selectedImage === image.id ? "primary.main" : "grey.300",
                },
                transition: "all 0.2s",
              }}
              onClick={() => onSelect(image.id)}
            >
              <Box
                component="img"
                src={image.src}
                alt={image.alt}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
