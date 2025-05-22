"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { Box, Grid, CircularProgress } from "@mui/material"
import { useGalleryImages, GalleryLoading } from "./GalleryIntegration"
=======
import { Box, Grid } from "@mui/material"
>>>>>>> clean-dev

interface ImageSelectorProps {
  selectedImage: string | null
  onSelect: (imageId: string) => void
<<<<<<< HEAD
}

export function ImageSelector({ selectedImage, onSelect }: ImageSelectorProps) {
  const { files, loading, error, getImageUrl } = useGalleryImages()
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadImageUrls = async () => {
      const urls: Record<string, string> = {}

      for (const file of files) {
        if (file.downloadUrl) {
          urls[file.id] = file.downloadUrl
        } else {
          const { s3Key, downloadUrl, ...rest } = file
          const url = await getImageUrl({
            s3Key,
            ...(downloadUrl ? { downloadUrl } : {}),
            ...rest,
          })
          if (url) {
            urls[file.id] = url
          }
        }
      }

      setImageUrls(urls)
    }

    if (files.length > 0) {
      loadImageUrls()
    }
  }, [files, getImageUrl])

  if (loading) {
    return <GalleryLoading />
  }

  if (error) {
    return <Box sx={{ p: 3, color: "error.main" }}>{error}</Box>
  }

  if (files.length === 0) {
=======
  images: { id: string; src: string; alt: string }[]
}

export function ImageSelector({ selectedImage, onSelect, images }: ImageSelectorProps) {
  if (images.length === 0) {
>>>>>>> clean-dev
    return <Box sx={{ p: 3 }}>No images found in your gallery. Please upload some images first.</Box>
  }

  return (
    <Box sx={{ maxHeight: "400px", overflowY: "auto", p: 1 }}>
      <Grid container spacing={2}>
<<<<<<< HEAD
        {files.map((file) => (
          <Grid item xs={6} sm={4} key={file.id}>
=======
        {images.map((image) => (
          <Grid item xs={6} sm={4} key={image.id}>
>>>>>>> clean-dev
            <Box
              sx={{
                position: "relative",
                paddingTop: "100%",
                cursor: "pointer",
                borderRadius: 1,
                overflow: "hidden",
                border: 6,
<<<<<<< HEAD
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
=======
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
>>>>>>> clean-dev
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> clean-dev
