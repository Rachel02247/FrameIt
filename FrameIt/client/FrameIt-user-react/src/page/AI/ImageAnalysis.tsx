"use client"

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
  LinearProgress,
  Chip,
  Stack,
} from "@mui/material"
import { ArrowBack, ImageSearch } from "@mui/icons-material"
import { ImageSelector } from "../../component/AI/ImageSelector"
import { analyzeImage } from "../../services/aiService"
import { useSnackbar } from "notistack"
import { useGalleryImages } from "../../component/AI/GalleryIntegration"
import { AnalysisResult } from "../../types"

function ImageAnalysis() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
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
    setAnalysisResults(null)
  }

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedImageUrl) return

    setIsAnalyzing(true)

    try {
      // Call the AI service to analyze the image
      const results = await analyzeImage(selectedImageUrl)

      if (results) {
        setAnalysisResults(results)
      } else {
        enqueueSnackbar("Could not analyze the image. Please try again.", {
          variant: "error", // No changes needed here
        })
      }
    } catch (error) {
      console.error("Error analyzing image:", error)
      enqueueSnackbar("An error occurred during image analysis.", {
        variant: "error", // No changes needed here
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/myWorkspace/aiFeatures")} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Image Analysis
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
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  onClick={handleAnalyze}
                  disabled={!selectedImage || isAnalyzing}
                  startIcon={<ImageSearch />}
                  fullWidth
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Analysis Results
              </Typography>

              {selectedImage && !analysisResults && !isAnalyzing && (
                <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
                  Click "Analyze Image" to start AI analysis
                </Box>
              )}

              {isAnalyzing && (
                <Box sx={{ py: 4 }}>
                  <Typography align="center" gutterBottom>
                    Analyzing image...
                  </Typography>
                  <LinearProgress />
                </Box>
              )}

              {analysisResults && (
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Detected Objects:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {analysisResults.objects.map((obj, index) => (
                        <Chip key={index} label={obj} color="primary" />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Dominant Colors:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {analysisResults.colors.map((color, index) => (
                        <Chip key={index} label={color} variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Scene Type:
                    </Typography>
                    <Typography>{analysisResults.scene}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Confidence Score:
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={analysisResults.confidence}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    <Typography variant="caption" align="right" display="block" sx={{ mt: 0.5 }}>
                      {analysisResults.confidence}%
                    </Typography>
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ImageAnalysis
