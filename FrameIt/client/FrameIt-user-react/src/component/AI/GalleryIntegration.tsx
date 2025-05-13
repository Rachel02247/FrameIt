"use client"

import { useEffect } from "react"
import { Box, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../global-states/store"
import { fetchFilesByUserId, getFileDownloadUrl } from "../global-states/fileSlice"
import LoadingIndicator from "../../hooks/loadingIndicator"

// This component will fetch and provide images from your gallery
export function useGalleryImages() {

  const dispatch = useDispatch<AppDispatch>()
  const files = useSelector((state: RootState) => state.files.files)
  const loading = useSelector((state: RootState) => state.files.loading)
  const error = useSelector((state: RootState) => state.files.error)
  const userId = useSelector((state: RootState) => state.user.user?.id)

  useEffect(() => {
    if (userId) {
        dispatch(fetchFilesByUserId(Number(userId)))
    }

  }, [userId, dispatch])

  const getImageUrl = async (file: { s3Key: string }) => {    
    return await dispatch(getFileDownloadUrl(file.s3Key)).unwrap();
  }

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
