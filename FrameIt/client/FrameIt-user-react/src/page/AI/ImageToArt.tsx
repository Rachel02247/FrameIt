"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
import { ArrowBack, Download, Loop, Email } from "@mui/icons-material"
import { ImageSelector } from "../../component/AI/ImageSelector"
import { useSnackbar } from "notistack"
import { useGalleryImages } from "../../component/AI/GalleryIntegration"
import { transformImageToArt } from "../../services/aiService"
import { sendEmail } from "../../hooks/sendEmail";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../component/global-states/store";
import { getFileDownloadUrl } from "../../component/global-states/fileSlice";

const artStyles = [
  { id: "picasso", name: "Picasso", description: "Cubist style with geometric shapes" },
  { id: "vangogh", name: "Van Gogh", description: "Expressive brushstrokes and vibrant colors" },
  { id: "watercolor", name: "Watercolor", description: "Soft, transparent washes of color" },
  { id: "pop-art", name: "Pop Art", description: "Bold colors and outlines, comic book style" },
  { id: "realistic", name: "Realistic", description: "Detailed and true-to-life representation" },
  { id: "anime", name: "Anime", description: "Japanese animation style" },
]

const BATCH_SIZE = 10;

function ImageToArt() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("picasso");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArt, setGeneratedArt] = useState<string | null>(null);
  const { files } = useGalleryImages();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [currentBatch, setCurrentBatch] = useState(0); // Track the current batch index
  type DisplayedImage = { id: string; src: string; alt: string };
  const [displayedImages, setDisplayedImages] = useState<DisplayedImage[]>([]); // Images to display
  // const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(new Set()); // Track loaded image IDs

  useEffect(() => {
    const loadSelectedImageUrl = async () => {
      if (selectedImage) {
        const selectedFile = files.find((file) => file.id === selectedImage);
        if (selectedFile) {
          if (selectedFile.downloadUrl) {
            setSelectedImageUrl(selectedFile.downloadUrl);
          } else {
            const url = await dispatch(getFileDownloadUrl(selectedFile.s3Key)).unwrap();
            setSelectedImageUrl(url);
          }
        }
      } else {
        setSelectedImageUrl(null);
      }
    };

    loadSelectedImageUrl();
  }, [selectedImage, files, dispatch]);


const loadedImageIdsRef = useRef<Set<string>>(new Set());

useEffect(() => {
  const loadBatch = async () => {
    const startIndex = currentBatch * BATCH_SIZE;
    const endIndex = startIndex + BATCH_SIZE;
    const batch = files.slice(startIndex, endIndex);

    const urls: Record<string, string> = {};
    const newImages: DisplayedImage[] = [];

    await Promise.all(
      batch.map(async (file) => {
        if (!loadedImageIdsRef.current.has(file.id)) {
          if (file.downloadUrl) {
            urls[file.id] = file.downloadUrl;
          } else if (!urls[file.id]) {
            const url = await dispatch(getFileDownloadUrl(file.s3Key)).unwrap();
            urls[file.id] = url;
          }

          newImages.push({
            id: file.id,
            src: urls[file.id] || "",
            alt: file.fileName,
          });

          loadedImageIdsRef.current.add(file.id);
        }
      })
    );

    setDisplayedImages((prev) => [...prev, ...newImages]);
  };

  if (files.length > 0 && currentBatch * BATCH_SIZE < files.length) {
    loadBatch();
  }
}, [currentBatch, files, dispatch]);
;

  const handleLoadMore = () => {
    if (currentBatch * BATCH_SIZE < files.length) {
      setCurrentBatch((prev) => prev + 1); // Increment batch index to load the next batch
    }
  };

  const handleImageSelect = (imageId: string) => {
    setSelectedImage(imageId);
    setGeneratedArt(null);
  };

  const handleStyleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStyle(event.target.value);
    setGeneratedArt(null);
  };

  const handleGenerateArt = async () => {
    if (!selectedImage || !selectedStyle || !selectedImageUrl) return;

    setIsGenerating(true);

    try {
      // Call the AI service to transform the image
      const artUrl = await transformImageToArt(selectedImageUrl, selectedStyle);

      if (artUrl !== undefined && artUrl !== null) {
        setGeneratedArt(artUrl);
      } else {
        enqueueSnackbar("Could not generate artwork. Please try again.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error generating art:", error);
      enqueueSnackbar("An error occurred during art generation.", {
        variant: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedArt) return;

    const link = document.createElement("a");
    link.href = generatedArt;
    link.download = `art-${selectedStyle}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEmail = async () => {
  if (!generatedArt) return;

  const tempContainer = document.createElement("div");
  tempContainer.style.position = "fixed";
  tempContainer.style.left = "-9999px"; 
  const imgElement = document.createElement("img");
  imgElement.src = generatedArt;
  imgElement.alt = "Generated artwork";
  imgElement.style.width = "500px"; 
  imgElement.style.height = "auto";

  tempContainer.appendChild(imgElement);
  document.body.appendChild(tempContainer);

  try {
    await sendEmail(tempContainer);
  } catch (error) {
    console.error("Error sending email:", error);
  } finally {
    document.body.removeChild(tempContainer);
  }
};


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
              <ImageSelector
                selectedImage={selectedImage}
                onSelect={handleImageSelect}
                images={displayedImages} 
              />
              {currentBatch * BATCH_SIZE < files.length && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button variant="contained" onClick={handleLoadMore}>
                    Load More
                  </Button>
                </Box>
              )}
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
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" onClick={handleDownload} startIcon={<Download />}>
                  Download Artwork
                </Button>
                <Button variant="contained" color="secondary" onClick={handleSendEmail} startIcon={<Email />}>
                  Send via Email
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default ImageToArt;
