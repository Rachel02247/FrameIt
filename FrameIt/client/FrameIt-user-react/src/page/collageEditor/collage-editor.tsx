"use client"

import { useState, useRef, useEffect } from "react"
import { toPng } from "html-to-image"
import { ImageUploader } from "./image-uploader"
import { TemplateSelector } from "./template-selector"
import { AspectRatioSelector } from "./aspect-ratio-selector"
import { BackgroundColorPicker } from "./background-color-picker"
import { CollageCanvas } from "./collage-canvas"
import { Divider, Button, Box, Typography, Paper } from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download"
import type { CollageImage, Template, AspectRatio } from "../../types"
import { useTheme } from "@mui/material/styles"
import { sendEmail } from "../../hooks/sendEmail"

const CollageEditor = () => {
  const theme = useTheme()
  const [images, setImages] = useState<CollageImage[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>({ id: "1:1", name: "Square (1:1)", value: 1 })
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff")
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const collageRef = useRef<HTMLDivElement>(null)
  const [canvasWidth, setCanvasWidth] = useState<number>(600)
  const [canvasHeight, setCanvasHeight] = useState<number>(600)

  useEffect(() => {
    const updateCanvasSize = () => {
      const maxWidth = window.innerWidth * 0.8 // Limit canvas width to 80% of the viewport
      const maxHeight = window.innerHeight * 0.5 // Limit canvas height to 50% of the viewport
      const calculatedWidth = Math.min(maxWidth, 600) // Ensure it doesn't exceed 600px
      const calculatedHeight = calculatedWidth / aspectRatio.value
      setCanvasWidth(calculatedWidth)
      setCanvasHeight(Math.min(calculatedHeight, maxHeight)) // Ensure height fits within the viewport
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [aspectRatio])

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

    if (selectedTemplate && newImages.length > 0) {
      applyTemplate([...images, ...newImages])
    }
  }

  const applyTemplate = (imagesToArrange: CollageImage[] = images) => {
    if (!selectedTemplate || imagesToArrange.length === 0) return

    const arrangedImages = [...imagesToArrange]
    const templatePositions = selectedTemplate.layout

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
    setBackgroundColor(color) // Update background color immediately
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

  const handleSendEmail = () => {
    if (!collageRef.current)
      return
    sendEmail(collageRef.current)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, p: 3, maxWidth: "80%", mx: "auto" }}>
      {/* Title */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Collage Editor
      </Typography>

      {/* Canvas Section */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 3, mb: 3 }}>
        {/* Canvas */}
        <CollageCanvas
          ref={collageRef}
          images={images}
          backgroundColor={backgroundColor} // Pass updated background color
          width={canvasWidth}
          height={canvasHeight}
          selectedImageId={selectedImageId}
          onImageSelect={handleImageSelect}
          onImageUpdate={handleImageUpdate}
          onImageRemove={handleImageRemove}
        />

        {/* Upload and Download Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <ImageUploader onUpload={handleImageUpload} />

          <Button
            variant="contained"
            color="primary"
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
          >
            Download Collage
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSendEmail}
          >
            Send by Email
          </Button>
        </Box>


        <Divider sx={{ width: "100%", my: 2 }} />

        {/* Options Section */}
        <Paper sx={{ p: 3, bgcolor: theme.palette.background.paper, display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            <TemplateSelector onSelect={handleTemplateSelect} />
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            <AspectRatioSelector selectedRatio={aspectRatio} onChange={handleAspectRatioChange} />
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            <BackgroundColorPicker color={backgroundColor} onChange={handleBackgroundColorChange} />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default CollageEditor
