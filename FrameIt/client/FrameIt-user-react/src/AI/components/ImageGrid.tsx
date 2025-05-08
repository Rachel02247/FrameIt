"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, Grid, Box } from "@mui/material"

interface ImageProps {
  id: string
  src: string
  alt: string
  tags?: string
  description?: string
}

interface ImageGridProps {
  images: ImageProps[]
}

export function ImageGrid({ images }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null)

  if (images.length === 0) {
    return <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>No images found</Box>
  }

  return (
    <>
      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid item xs={6} sm={4} md={3} key={image.id}>
            <Box
              sx={{
                position: "relative",
                paddingTop: "100%", // 1:1 Aspect Ratio
                cursor: "pointer",
                borderRadius: 1,
                overflow: "hidden",
                "&:hover": {
                  opacity: 0.9,
                  transition: "opacity 0.3s",
                },
              }}
              onClick={() => setSelectedImage(image)}
            >
              <Box
                component="img"
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="lg">
        <DialogContent>
          {selectedImage && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "60vh",
                  "& img": {
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                  },
                }}
              >
                <img
                  src={selectedImage.src || "/placeholder.svg"}
                  alt={selectedImage.alt}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </Box>
              {selectedImage.description && <Box sx={{ mt: 2, textAlign: "center" }}>{selectedImage.description}</Box>}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
