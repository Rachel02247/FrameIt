"use client"

import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import axios from "axios"
import type { MyFile } from "../../types"

// This component will fetch and provide images from your gallery
export function useGalleryImages() {
  const [files, setFiles] = useState<MyFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = "http://localhost:5282"

  // Assuming userId is available - in a real app, you'd get this from your auth system
  const userId = localStorage.getItem("userId") || "0" // Fallback to '1' if not found

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        // Fetch from root folder (id '0')
        const url = `${API_BASE_URL}/folders/0/contents/${userId}`
        const { data } = await axios.get(url)

        // Filter to only include image files
        const imageFiles = data.files.filter((file: MyFile) =>
          ["jpg", "jpeg", "png", "gif", "webp"].includes(file.fileType.toLowerCase()),
        )

        setFiles(imageFiles)
      } catch (error) {
        console.error("Error fetching gallery images:", error)
        setError("Failed to load your images. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [userId])

  // Function to get presigned URL for an image
  const getImageUrl = async (s3Key: string): Promise<string> => {
    try {
      const encodedKey = encodeURIComponent(s3Key)
      const response = await fetch(`${API_BASE_URL}/files/generate-url?s3Key=${encodedKey}`)

      if (!response.ok) {
        throw new Error("Failed to fetch presigned URL")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error getting image URL:", error)
      return ""
    }
  }

  return { files, loading, error, getImageUrl }
}

// Component to display a loading state while fetching gallery images
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
