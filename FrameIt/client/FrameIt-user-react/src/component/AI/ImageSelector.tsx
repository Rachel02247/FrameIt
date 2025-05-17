"use client"

import { useState, useEffect } from "react"
import { Box, Grid, CircularProgress } from "@mui/material"
import { useGalleryImages, GalleryLoading } from "./GalleryIntegration"

interface ImageSelectorProps {
  selectedImage: string | null
  onSelect: (imageId: string) => void
}

export function ImageSelector({ selectedImage, onSelect }: ImageSelectorProps) {
  const { files, loading, error, getImageUrl } = useGalleryImages()
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load presigned URLs for all images
    const loadImageUrls = async () => {
      const urls: Record<string, string> = {}

      for (const file of files) {
        const url = await getImageUrl({ s3Key: file.s3Key })
        if (url) {
          urls[file.id] = url
        }
      }

      setImageUrls(urls)
    }

    if (files.length > 0) {
      loadImageUrls()
    }
  }, [])

  if (loading) {
    return <GalleryLoading />
  }

  if (error) {
    return <Box sx={{ p: 3, color: "error.main" }}>{error}</Box>
  }

  if (files.length === 0) {
    return <Box sx={{ p: 3 }}>No images found in your gallery. Please upload some images first.</Box>
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
                border: 6,
                borderColor: selectedImage === file.id ? "primary.main" : "transparent",
                "&:hover": {
                  borderColor: selectedImage === file.id ? "primary.main" : "grey.300",
                },
                transition: "all 0.2s",
              }}
              onClick={() => onSelect(file.id)}
            >
              {imageUrls[file.id] ? (
                <Box
                  component="img"
                  src={imageUrls[file.id]}
                  alt={file.fileName}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.100",
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}