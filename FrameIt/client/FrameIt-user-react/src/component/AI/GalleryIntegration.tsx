"use client"

import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import type { MyFile } from "../../types"

// This component will fetch and provide images from your gallery
export function useGalleryImages() {
  const [files, setFiles] = useState<MyFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  const userId = localStorage.getItem("userId") || "0" 

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {

        const { data } = fetchFilesByUserId(userId);
        setFiles(data)
      } catch (error) {
        console.error("Error fetching gallery images:", error)
        setError("Failed to load your images. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [userId])

 

  return { files, loading, error, getImageUrl }
}

export function GalleryLoading() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading your gallery images...
      </Typography>
    </Box>
  )
}
