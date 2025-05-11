"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from "@mui/material"
import { ArrowBack, Download, Loop } from "@mui/icons-material"
import { ImageSelector } from "../../component/AI/ImageSelector"
import { useSnackbar } from "notistack"
import { useGalleryImages } from "../../component/AI/GalleryIntegration"

const artStyles = [
  { id: "picasso", name: "Picasso", description: "Cubist style with geometric shapes" },
  { id: "vangogh", name: "Van Gogh", description: "Expressive brushstrokes and vibrant colors" },
  { id: "watercolor", name: "Watercolor", description: "Soft, transparent washes of color" },
  { id: "pop-art", name: "Pop Art", description: "Bold colors and outlines, comic book style" },
  { id: "realistic", name: "Realistic", description: "Detailed and true-to-life representation" },
  { id: "anime", name: "Anime", description: "Japanese animation style" },
]

function ImageToArt() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string>("picasso")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedArt, setGeneratedArt] = useState<string | null>(null)
  const { files, getImageUrl } = useGalleryImages()
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const loadSelectedImageUrl = async () => {
      if (selectedImage) {
        const selectedFile = files.find((file) => file.id === selectedImage)
        if (selectedFile) {
          const url = await getImageUrl(selectedFile.s3Key)
          setSelectedImageUrl(url)
        }
      } else {
        setSelectedImageUrl(null)
      }
    }

    loadSelectedImageUrl()
  }, [selectedImage, files, getImageUrl])

  const handleImageSelect = (imageId: string) => {
    setSelectedImage(imageId)
    setGeneratedArt(null)
  }

  const handleStyleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStyle(event.target.value)
    setGeneratedArt(null)
  }

  const handleGenerateArt = async () => {
    if (!selectedImage || !selectedStyle || !selectedImageUrl) return

    setIsGenerating(true)

    try {
      // Call the AI service to transform the image
      const artUrl = await transformImageToArt(selectedImageUrl, selectedStyle)

      if (artUrl !== undefined && artUrl !== null) {
        setGeneratedArt(artUrl)
      } else {
        enqueueSnackbar("Could not generate artwork. Please try again.", {
          variant: "error", 
        })
      }
    } catch (error) {
      console.error("Error generating art:", error)
      enqueueSnackbar("An error occurred during art generation.", {
        variant: "error", 
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedArt) return

    const link = document.createElement("a")
    link.href = generatedArt
    link.download = `art-${selectedStyle}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/myWorkspace/aiFeatures")} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Image to Art
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Select an Image from Your Gallery
              </Typography>
              <ImageSelector selectedImage={selectedImage} onSelect={handleImageSelect} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Choose Art Style
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup value={selectedStyle} onChange={handleStyleSelect}>
                  <Grid container spacing={2}>
                    {artStyles.map((style) => (
                      <Grid item xs={12} sm={6} key={style.id}>
                        <FormControlLabel
                          value={style.id}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="subtitle1">{style.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {style.description}
                              </Typography>
                            </Box>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleGenerateArt}
          disabled={!selectedImage || !selectedStyle || isGenerating}
          startIcon={isGenerating ? <Loop /> : null}
        >
          {isGenerating ? "Generating Art..." : "Transform to Art"}
        </Button>
      </Box>

      {generatedArt && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Generated Artwork
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "400px",
                  mb: 2,
                  "& img": {
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  },
                }}
              >
                <img src={generatedArt || "/placeholder.svg"} alt="Generated artwork" />
              </Box>
              <Button variant="contained" onClick={handleDownload} startIcon={<Download />}>
                Download Artwork
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default ImageToArt
