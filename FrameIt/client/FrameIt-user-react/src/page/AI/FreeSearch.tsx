/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

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
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material"
import { ArrowBack, Search } from "@mui/icons-material"
import { ImageGrid } from "../../component/AI/ImageGrid"
import { searchImagesByDescription } from "../../services/aiService"
import { useSnackbar } from "notistack"
import { useGalleryImages } from "../../component/AI/GalleryIntegration"

function FreeSearch() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  interface ImageProps {
    id: string
    src: string
    alt: string
    score?: number
  }

  const [searchResults, setSearchResults] = useState<ImageProps[]>([]) // Ensure the type matches ImageGrid
  const [hasSearched, setHasSearched] = useState(false)
  const { files, loading, getImageUrl } = useGalleryImages()
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadImageUrls = async () => {
      const urls: Record<string, string> = {}

      for (const file of files) {
        const url = await getImageUrl({ s3Key: file.s3Key }) // Fixed to use `s3Key` instead of `id`
        if (url) {
          urls[file.id] = url
        }
      }

      setImageUrls(urls)
    }

    if (files.length > 0) {
      loadImageUrls()
    }
  }, [files, getImageUrl])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    try {
      const imageUrlsArray = Object.values(imageUrls)

      const results = await searchImagesByDescription(searchQuery, imageUrlsArray)

      if (results && results.length > 0) {
        const matchedImages = results
          .map((result) => {
            const fileId = Object.keys(imageUrls).find((id) => imageUrls[id] === result.imageUrl)
            if (!fileId) return null

            const matchedFile = files.find((file) => file.id === fileId)
            return matchedFile
              ? {
                  id: matchedFile.id,
                  src: result.imageUrl,
                  alt: matchedFile.fileName,
                  score: result.relevanceScore,
                }
              : null
          })
          .filter(Boolean)

        setSearchResults(matchedImages as any[])
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error("Error searching images:", error)
      enqueueSnackbar("Could not complete the search. Please try again.", {
        variant: "error",
      })
      setSearchResults([])
    } finally {
      setIsSearching(false)
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
            Free Search
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
          Free Search
        </Typography>
      </Box>

      <Card className="mb-8">
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Search Images Using Natural Language
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Describe what you're looking for, and our AI will find matching images.
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <TextField
              placeholder="Describe what you're looking for (e.g., 'child playing in garden')"
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
              startIcon={isSearching ? <CircularProgress size={20} color="inherit" /> : <Search />}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardContent>
            {isSearching ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography>Searching for images that match "{searchQuery}"...</Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h6" component="h2" gutterBottom>
                  Search Results for "{searchQuery}"
                </Typography>

                {searchResults.length > 0 ? (
                  <ImageGrid images={searchResults} /> // Pass the correctly typed `searchResults` to ImageGrid
                ) : (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No images found matching your description. Try a different search term.
                  </Alert>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default FreeSearch