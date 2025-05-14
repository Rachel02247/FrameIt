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
  Grid,
} from "@mui/material"
import { ArrowBack, Search } from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "../../component/global-states/store"
import { fetchFilesByUserId } from "../../component/global-states/fileSlice"

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
  const files = useSelector((state: RootState) => state.files.files)
  const loading = useSelector((state: RootState) => state.files.loading)

  const userId = sessionStorage.getItem("id") || 0

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredImages, setFilteredImages] = useState<any[]>([])
  const [tabValue, setTabValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {

    dispatch(fetchFilesByUserId(parseInt(userId as string))) 
  }, [dispatch])

  useEffect(() => {
    // Convert files to the format expected by ImageGrid
    const convertFilesToImageGrid = () => {
      return files.map((file) => ({
        id: file.id,
        src: file.downloadUrl || "/placeholder.svg", // Use placeholder if downloadUrl is not ready
        alt: file.fileName,
        tags: file.fileType,
      }))
    }

    setFilteredImages(convertFilesToImageGrid())
  }, [files])

  const handleSearch = () => {
    setIsLoading(true)

    // Simulate AI-based filtering with a timeout
    setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredImages(
          files.map((file) => ({
            id: file.id,
            src: file.downloadUrl || "/placeholder.svg",
            alt: file.fileName,
            tags: file.fileType,
          })),
        )
      } else {
        const filtered = files
          .filter((file) => file.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((file) => ({
            id: file.id,
            src: file.downloadUrl || "/placeholder.svg",
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

    setTimeout(() => {
      if (category === selectedCategory) {
        setFilteredImages(
          files.map((file) => ({
            id: file.id,
            src: file.downloadUrl || "/placeholder.svg",
            alt: file.fileName,
            tags: file.fileType,
          })),
        )
      } else {
        const filtered = files
          .filter(() => Math.random() > 0.5) // Random filtering for demo
          .map((file) => ({
            id: file.id,
            src: file.downloadUrl || "/placeholder.svg",
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/aiFeatures")} sx={{ mr: 1 }}>
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
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Search />}
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

          {loading || isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredImages.map((image) => (
                <Grid item xs={6} sm={4} md={3} key={image.id}>
                  <Box
                    sx={{
                      position: "relative",
                      paddingTop: "100%", // 1:1 Aspect Ratio
                      borderRadius: 1,
                      overflow: "hidden",
                      backgroundColor: "grey.200", // Placeholder background
                    }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default SmartFiltering