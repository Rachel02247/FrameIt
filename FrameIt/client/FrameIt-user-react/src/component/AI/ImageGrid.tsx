/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, Grid, Box } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../global-states/store"
import { fetchFilesByUserId, selectFiles } from "../global-states/fileSlice"
import { MyFile } from "../../types"

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

export function ImageGrid() {
  const dispatch = useDispatch<AppDispatch>()
  const files = useSelector(selectFiles)
  const loading = useSelector((state: RootState) => state.files.loading)
  const error = useSelector((state: RootState) => state.files.error) // Added error handling
  const userId = sessionStorage.getItem("id") || "0"

  const [selectedImage, setSelectedImage] = useState<MyFile | null>(null) // Fixed type to MyFile

  useEffect(() => {
    if (userId) {
      dispatch(fetchFilesByUserId(Number(userId)))
    }
  }, [userId, dispatch])

  if (loading) {
    return <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>Loading files...</Box>
  }

  if (error) {
    return <Box sx={{ textAlign: "center", py: 6, color: "error.main" }}>Error: {error}</Box> // Display error
  }

  if (files.length === 0) {
    return <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>No files found</Box>
  }

  return (
    <>
      <Grid container spacing={2}>
        {files.map((file) => (
          <Grid item xs={6} sm={4} md={3} key={file.id}>
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
              onClick={() => setSelectedImage(file)}
            >
              <Box
                component="img"
                src={`${import.meta.env.VITE_API_URL}/files/download/${file.s3Key}`}
                alt={file.fileName}
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
                  src={`${import.meta.env.VITE_API_URL}/files/download/${selectedImage.s3Key}`}
                  alt={selectedImage.fileName}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </Box>
              {selectedImage.fileName && (
                <Box sx={{ mt: 2, textAlign: "center" }}>{selectedImage.fileName}</Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
