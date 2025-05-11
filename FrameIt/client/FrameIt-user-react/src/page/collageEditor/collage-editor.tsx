"use client"

import { useState, useRef, useEffect } from "react"
import { toPng } from "html-to-image"
import { ImageUploader } from "./image-uploader"
import { TemplateSelector } from "./template-selector"
import { AspectRatioSelector } from "./aspect-ratio-selector"
import { BackgroundColorPicker } from "./background-color-picker"
import { CollageCanvas } from "./collage-canvas"
import { Button, Grid, Box, Typography, Paper } from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download"
import type { CollageImage, Template, AspectRatio } from "../../types"
import { useTheme } from "@mui/material/styles"

const CollageEditor = () => {
  const theme = useTheme()
  const [images, setImages] = useState<CollageImage[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>({ id: "1:1", name: "Square (1:1)", value: 1 })
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff")
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const collageRef = useRef<HTMLDivElement>(null)
  const [canvasWidth, ] = useState<number>(800)
  const [canvasHeight, setCanvasHeight] = useState<number>(800)

  useEffect(() => {
    // Update canvas height based on aspect ratio
    setCanvasHeight(canvasWidth / aspectRatio.value)
  }, [aspectRatio, canvasWidth])

  const handleImageUpload = (files: File[]) => {
    const newImages = files.map((file) => {
      const id = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      return {
        id,
        file,
        url: URL.createObjectURL(file),
        width: 200,
        height: 200,
        x: 0,
        y: 0,
        rotation: 0,
        flipped: false,
        scale: 1,
      }
    })

    setImages((prevImages) => [...prevImages, ...newImages])

    // Apply template if selected
    if (selectedTemplate && newImages.length > 0) {
      applyTemplate([...images, ...newImages])
    }
  }

  const applyTemplate = (imagesToArrange: CollageImage[] = images) => {
    if (!selectedTemplate || imagesToArrange.length === 0) return

    const arrangedImages = [...imagesToArrange]
    const templatePositions = selectedTemplate.layout

    // Apply template positions to images
    for (let i = 0; i < Math.min(arrangedImages.length, templatePositions.length); i++) {
      const position = templatePositions[i]
      arrangedImages[i] = {
        ...arrangedImages[i],
        x: position.x * canvasWidth,
        y: position.y * canvasHeight,
        width: position.width * canvasWidth,
        height: position.height * canvasHeight,
        scale: 1,
        rotation: 0,
        flipped: false,
      }
    }

    setImages(arrangedImages)
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    applyTemplate()
  }

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    setAspectRatio(ratio)
  }

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color)
  }

  const handleImageSelect = (id: string) => {
    setSelectedImageId(id)
  }

  const handleImageUpdate = (updatedImage: CollageImage) => {
    setImages(images.map((img) => (img.id === updatedImage.id ? updatedImage : img)))
  }

  const handleImageRemove = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
    if (selectedImageId === id) {
      setSelectedImageId(null)
    }
  }

  const handleDownload = async () => {
    if (!collageRef.current) return

    try {
      const dataUrl = await toPng(collageRef.current, { quality: 0.95 })

      // Create a link element
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `collage-${new Date().toISOString().slice(0, 10)}.png`

      // Append to the document, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error generating image:", error)
    }
  }

  return (
    <Grid container spacing={3} ml={20}>
      <Grid item xs={12} lg={3}>
        <Paper sx={{ p: 3, bgcolor: theme.palette.background.paper }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Collage Editor
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <ImageUploader onUpload={handleImageUpload} />

            <TemplateSelector onSelect={handleTemplateSelect} />

            <AspectRatioSelector selectedRatio={aspectRatio} onChange={handleAspectRatioChange} />

            <BackgroundColorPicker color={backgroundColor} onChange={handleBackgroundColorChange} />

            <Button variant="contained" color="primary" fullWidth onClick={handleDownload} startIcon={<DownloadIcon />}>
              Download Collage
            </Button>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} lg={9}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CollageCanvas
            ref={collageRef}
            images={images}
            backgroundColor={theme.palette.background.default} // Use theme background
            width={canvasWidth}
            height={canvasHeight}
            selectedImageId={selectedImageId}
            onImageSelect={handleImageSelect}
            onImageUpdate={handleImageUpdate}
            onImageRemove={handleImageRemove}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

export default CollageEditor
