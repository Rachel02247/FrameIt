"use client"

import { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import type { MyFile } from "../../types"
import { fetchFilesByUserId } from "../../services/filesService"
import LoadingIndicator from "../../hooks/loadingIndicator"

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
        const data = await fetchFilesByUserId(Number(userId)) // Await the async function
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

  const getImageUrl = (s3Key: string) => `${import.meta.env.VITE_API_URL}/files/download/${s3Key}`

  return { files, loading, error, getImageUrl }
}

export function GalleryLoading() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
      <LoadingIndicator />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading your gallery images...
      </Typography>
    </Box>
  )
}
