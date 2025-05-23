/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material"
import { ArrowBack, Search } from "@mui/icons-material"
import { ImageGrid } from "../../component/AI/ImageGrid"
import { useGalleryImages } from "../../component/AI/GalleryIntegration"
import LoadingIndicator from "../../hooks/loadingIndicator"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../component/global-states/store"
import { getFileDownloadUrl } from "../../component/global-states/fileSlice"

const predefinedCategories = ["People", "Animals", "Nature", "Urban", "Food", "Travel", "Sports"]

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

function SmartFiltering() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { files, loading } = useGalleryImages()

  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Batch loading constants and states
  const BATCH_SIZE = 10
  const [currentBatch, setCurrentBatch] = useState(0)
  const [displayedImages, setDisplayedImages] = useState<any[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set())

  // Helper to load a batch of images
  const loadBatch = useCallback(async () => {
    if (!files.length) return

    const startIndex = currentBatch * BATCH_SIZE
    const endIndex = Math.min(startIndex + BATCH_SIZE, files.length)
    const batch = files.slice(startIndex, endIndex)

    const newUrls: Record<string, string> = {}
    const newImages: any[] = []

    await Promise.all(
      batch.map(async (file) => {
        if (loadedImageIds.has(file.id)) return

        let url = file.downloadUrl || imageUrls[file.id]
        if (!url) {
          try {
            url = await dispatch(getFileDownloadUrl(file.s3Key)).unwrap()
          } catch {
            url = ""
          }
        }

        if (url) {
          newUrls[file.id] = url
        }

        newImages.push({
          id: file.id,
          src: url || "",
          alt: file.fileName,
          tags: file.fileType,
        })
      }),
    )

    setImageUrls((prev) => ({ ...prev, ...newUrls }))
    setDisplayedImages((prev) => [...prev, ...newImages])
    setLoadedImageIds((prev) => {
      const updated = new Set(prev)
      newImages.forEach((img) => updated.add(img.id))
      return updated
    })
  }, [currentBatch, files, dispatch, imageUrls, loadedImageIds])

  // Load new batch whenever currentBatch or files change
  useEffect(() => {
    if (files.length === 0) return
    if (currentBatch * BATCH_SIZE >= files.length) return

    loadBatch()
  }, [currentBatch, files, loadBatch])

  // Reset batches when files change (new load)
  useEffect(() => {
    setDisplayedImages([])
    setLoadedImageIds(new Set())
    setImageUrls({})
    setCurrentBatch(0)
  }, [files])

  // Filtered images state and logic
  const [filteredImages, setFilteredImages] = useState<any[]>([])

  useEffect(() => {
    // Convert files to image grid format with URLs
    const images = files.map((file) => ({
      id: file.id,
      src: imageUrls[file.id] || "",
      alt: file.fileName,
      tags: file.fileType,
    }))
    setFilteredImages(images)
  }, [files, imageUrls])

  // Handle Search
  const handleSearch = () => {
    setIsLoading(true)
    setSelectedCategory(null)

    setTimeout(() => {
      if (!searchQuery.trim()) {
        setFilteredImages(
          files.map((file) => ({
            id: file.id,
            src: imageUrls[file.id] || "",
            alt: file.fileName,
            tags: file.fileType,
          })),
        )
      } else {
        const filtered = files
          .filter((file) => file.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((file) => ({
            id: file.id,
            src: imageUrls[file.id] || "",
            alt: file.fileName,
            tags: file.fileType,
          }))
        setFilteredImages(filtered)
      }
      setIsLoading(false)
    }, 1000)
  }

  // Handle Category Select
  const handleCategorySelect = (category: string) => {
    setIsLoading(true)
    setSearchQuery("")
    setSelectedCategory((prev) => (prev === category ? null : category))

    setTimeout(() => {
      if (selectedCategory === category) {
        setFilteredImages(
          files.map((file) => ({
            id: file.id,
            src: imageUrls[file.id] || "",
            alt: file.fileName,
            tags: file.fileType,
          })),
        )
      } else {
        // Example random filtering for demo
        const filtered = files
          .filter(() => Math.random() > 0.5)
          .map((file) => ({
            id: file.id,
            src: imageUrls[file.id] || "",
            alt: file.fileName,
            tags: file.fileType,
          }))
        setFilteredImages(filtered)
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setSearchQuery("")
    setSelectedCategory(null)
    setFilteredImages([])
  }

  const handleLoadMore = () => {
    if (currentBatch * BATCH_SIZE < files.length) {
      setCurrentBatch((prev) => prev + 1)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/myWorkspace/aiFeatures")} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Smart Filtering
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/myWorkspace/aiFeatures")} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Smart Filtering
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="filtering tabs">
          <Tab label="Predefined Categories" />
          <Tab label="Custom Search" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {predefinedCategories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategorySelect(category)}
              color={selectedCategory === category ? "primary" : "default"}
              variant={selectedCategory === category ? "filled" : "outlined"}
              sx={{ px: 1 }}
            />
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <TextField
            placeholder="Search for images (e.g., 'child playing in nature')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={isLoading ? <LoadingIndicator /> : <Search />}
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </Box>
      </TabPanel>

      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            {selectedCategory
              ? `${selectedCategory} Images`
              : searchQuery
              ? `Results for "${searchQuery}"`
              : "All Images"}
          </Typography>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <ImageGrid images={displayedImages.length ? displayedImages : filteredImages} />
              {currentBatch * BATCH_SIZE < files.length && !isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button variant="contained" onClick={handleLoadMore}>
                    Load More
                  </Button>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default SmartFiltering
