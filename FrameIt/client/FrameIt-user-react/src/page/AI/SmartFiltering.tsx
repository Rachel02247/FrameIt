/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
<<<<<<< HEAD
=======
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../component/global-states/store"
import { getFileDownloadUrl } from "../../component/global-states/fileSlice"
>>>>>>> clean-dev

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
<<<<<<< HEAD
  const [filteredImages, setFilteredImages] = useState<any[]>([])
  const [tabValue, setTabValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { files, loading, getImageUrl } = useGalleryImages()
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load presigned URLs for all images
    const loadImageUrls = async () => {
      const urls: Record<string, string> = {}

      for (const file of files) {
        // בדוק אם ה-downloadUrl כבר קיים
        if (file.downloadUrl) {
          urls[file.id] = file.downloadUrl
        } else if (!urls[file.id]) {
          const url = await getImageUrl({ s3Key: file.s3Key })
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

  // useEffect(() => {
  //   // Convert files to the format expected by ImageGrid
  //   const convertFilesToImageGrid = () => {
  //     return files.map((file) => ({
  //       id: file.id,
  //       src: imageUrls[file.id] || "",
  //       alt: file.fileName,
  //       tags: file.fileType, // In a real app, you'd have actual tags
  //     }))
  //   }

  //   if (Object.keys(imageUrls).length > 0) {
  //     setFilteredImages(convertFilesToImageGrid())
  //   }
  // }, [files, imageUrls])
  const [didInitialize, setDidInitialize] = useState(false);

  useEffect(() => {
    if (!didInitialize && files.length > 0 && Object.keys(imageUrls).length > 0) {
      const images = files.map((file) => ({
        id: file.id,
        src: imageUrls[file.id] || "",
        alt: file.fileName,
        tags: file.fileType,
      }));
      setFilteredImages(images);
      setDidInitialize(true);
    }
  }, [files, imageUrls, didInitialize]);



=======
  const [, setFilteredImages] = useState<any[]>([])
  const [tabValue, setTabValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { files, loading,  } = useGalleryImages()
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  const dispatch = useDispatch<AppDispatch>()

  const BATCH_SIZE = 10; 
  const [currentBatch, setCurrentBatch] = useState(0); // Track the current batch index
  const [displayedImages, setDisplayedImages] = useState<any[]>([]); // Images to display
  const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set()); // Track loaded image IDs

  useEffect(() => {
    const loadBatch = async () => {
      const startIndex = currentBatch * BATCH_SIZE;
      const endIndex = startIndex + BATCH_SIZE;
      const batch = files.slice(startIndex, endIndex);

      const urls: Record<string, string> = {};
      const newImages: any[] = [];

      await Promise.all(
        batch.map(async (file) => {
          if (!loadedImageIds.has(file.id)) {
            if (file.downloadUrl) {
              urls[file.id] = file.downloadUrl;
            } else if (!imageUrls[file.id]) {
              const url = await dispatch(getFileDownloadUrl(file.s3Key)).unwrap();
              if (url) {
                urls[file.id] = url;
              }
            }

            newImages.push({
              id: file.id,
              src: urls[file.id] || "",
              alt: file.fileName,
              tags: file.fileType,
            });
          }
        })
      );

      setImageUrls((prev) => ({ ...prev, ...urls }));
      setDisplayedImages((prev) => [...prev, ...newImages]);
      setLoadedImageIds((prev) => {
        const updatedSet = new Set(prev);
        newImages.forEach((image) => updatedSet.add(image.id));
        return updatedSet;
      });
    };

    if (files.length > 0 && currentBatch * BATCH_SIZE < files.length) {
      loadBatch();
    }
  }, [currentBatch, files, dispatch, imageUrls, loadedImageIds]);

  const handleLoadMore = () => {
    if (currentBatch * BATCH_SIZE < files.length) {
      setCurrentBatch((prev) => prev + 1); // Increment batch index to load the next batch
    }
  };

  useEffect(() => {
    // Convert files to the format expected by ImageGrid
    const convertFilesToImageGrid = () => {
      return files.map((file) => ({
        id: file.id,
        src: imageUrls[file.id] || "",
        alt: file.fileName,
        tags: file.fileType, // In a real app, you'd have actual tags
      }))
    }

    if (Object.keys(imageUrls).length > 0) {
      setFilteredImages(convertFilesToImageGrid())
    }
  }, [files, imageUrls])
>>>>>>> clean-dev

  const handleSearch = () => {
    setIsLoading(true)

    // Simulate AI-based filtering with a timeout
    setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredImages(
          files.map((file) => ({
            id: file.id,
            src: imageUrls[file.id] || "",
            alt: file.fileName,
            tags: file.fileType,
          })),
        )
      } else {
        // Simple client-side filtering - in a real app, this would call your AI service
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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category)
    setIsLoading(true)

    // Simulate AI-based category filtering with a timeout
    setTimeout(() => {
      if (category === selectedCategory) {
        setFilteredImages(
          files.map((file) => ({
            id: file.id,
            src: imageUrls[file.id] || "",
            alt: file.fileName,
            tags: file.fileType,
          })),
        )
      } else {
        // In a real app, this would call your AI service to categorize images
        // For now, we'll just randomly filter some images
        const filtered = files
          .filter(() => Math.random() > 0.5) // Random filtering for demo
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
<<<<<<< HEAD
            startIcon={isLoading ? <LoadingIndicator /> : <Search />}
=======
            startIcon={isLoading ? <LoadingIndicator/>: <Search />}
>>>>>>> clean-dev
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
<<<<<<< HEAD
            <ImageGrid images={filteredImages} />
=======
            <>
              <ImageGrid images={displayedImages} />
              {currentBatch * BATCH_SIZE < files.length && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button variant="contained" onClick={handleLoadMore}>
                    Load More
                  </Button>
                </Box>
              )}
            </>
>>>>>>> clean-dev
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

<<<<<<< HEAD
export default SmartFiltering
=======
export default SmartFiltering


>>>>>>> clean-dev
