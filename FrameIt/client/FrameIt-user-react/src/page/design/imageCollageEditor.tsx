import React, { useState, useRef } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Delete, CloudUpload, ZoomIn, ZoomOut, RotateLeft, RotateRight, Flip } from "@mui/icons-material";
import html2canvas from "html2canvas";

const collageTemplates = [
  { id: 1, name: "Single Row", grid: "repeat(1, 1fr)" },
  { id: 2, name: "Two Columns", grid: "repeat(2, 1fr)" },
  { id: 3, name: "Three Columns", grid: "repeat(3, 1fr)" },
  { id: 4, name: "Four Columns", grid: "repeat(4, 1fr)" },
  { id: 5, name: "Grid", grid: "repeat(3, 3fr)" },
  { id: 6, name: "Masonry", grid: "repeat(2, 2fr)" }
];

const aspectRatios = [
  { label: "1:1", width: 450, height: 450 },
  { label: "3:4", width: 450, height: 600 },
  { label: "6:9", width: 450, height: 675 },
  { label: "5:7", width: 450, height: 630 },
  { label: "Wide", width: 600, height: 450 }
];

const ImageCollageEditor = () => {
  const [images, setImages] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(collageTemplates[0]);
  const [workspaceSize, setWorkspaceSize] = useState(aspectRatios[0]);
  const [selectedImage, setSelectedImage] = useState(null);
  const imageRefs = useRef([]);
  
  // Handle image drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newImages = files.map((file) => ({
      src: URL.createObjectURL(file),
      position: { x: 0, y: 0 },
      size: 160,
      rotation: 0,
      flipped: false,
    }));
    setImages([...images, ...newImages]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      src: URL.createObjectURL(file),
      position: { x: 0, y: 0 },
      size: 160,
      rotation: 0,
      flipped: false,
    }));
    setImages([...images, ...newImages]);
  };

  // Handle image rotation
  const handleRotate = (index, direction) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index].rotation += direction === "left" ? -90 : 90;
      return updatedImages;
    });
  };

  // Handle image flip
  const handleFlip = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index].flipped = !updatedImages[index].flipped;
      return updatedImages;
    });
  };

  // Handle resizing
  const handleResize = (index, action) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      if (action === "increase") updatedImages[index].size += 20;
      if (action === "decrease") updatedImages[index].size -= 20;
      return updatedImages;
    });
  };

  // Download collage as image
  const downloadCollage = () => {
    const collage = document.getElementById("collage-container");
    html2canvas(collage).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "collage.png";
      link.click();
    });
  };

  return (
    <Box sx={{ p: 4, maxWidth: "90%", mx: "auto", textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Image Collage Editor
      </Typography>

      <Box mb={2}>
        {/* Image Upload Icon */}
        <Box
          sx={{
            border: "2px dashed gray",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <IconButton>
              <CloudUpload />
            </IconButton>
          </label>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Drag and drop images here or click to upload
          </Typography>
        </Box>
      </Box>

      {/* Template Selection */}
      <Box mb={2}>
        {collageTemplates.map((template) => (
          <Button
            key={template.id}
            variant={selectedTemplate.id === template.id ? "contained" : "outlined"}
            onClick={() => setSelectedTemplate(template)}
            sx={{ mx: 1 }}
          >
            {template.name}
          </Button>
        ))}
      </Box>

      {/* Aspect Ratio Selection */}
      <Box mb={2}>
        {aspectRatios.map((ratio) => (
          <Button
            key={ratio.label}
            variant={workspaceSize.label === ratio.label ? "contained" : "outlined"}
            onClick={() => setWorkspaceSize(ratio)}
            sx={{ mx: 1 }}
          >
            {ratio.label}
          </Button>
        ))}
      </Box>

      {/* Collage Display */}
      <Box
        id="collage-container"
        sx={{
          position: "relative",
          width: workspaceSize.width,
          height: workspaceSize.height,
          border: "1px solid gray",
          borderRadius: 2,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: selectedTemplate.grid,
          gap: 1,
          mx: "auto",
          backgroundColor: "#f0f0f0",
        }}
      >
        {/* Render images in the grid */}
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: image.position.y,
              left: image.position.x,
              width: `${image.size}px`,
              height: `${image.size}px`,
              backgroundImage: `url(${image.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "move",
              transform: `rotate(${image.rotation}deg) ${image.flipped ? "scaleX(-1)" : ""}`,
              borderRadius: "8px", // Rounded corners
              transition: "all 0.3s ease", // Smooth transition
            }}
            onMouseDown={(e) => {
              // Handle drag and drop
              imageRefs.current[index] = { startX: e.clientX, startY: e.clientY };
            }}
            onMouseMove={(e) => {
              if (imageRefs.current[index]) {
                const deltaX = e.clientX - imageRefs.current[index].startX;
                const deltaY = e.clientY - imageRefs.current[index].startY;
                setImages((prevImages) => {
                  const updatedImages = [...prevImages];
                  updatedImages[index].position = {
                    x: updatedImages[index].position.x + deltaX,
                    y: updatedImages[index].position.y + deltaY,
                  };
                  return updatedImages;
                });
                imageRefs.current[index].startX = e.clientX;
                imageRefs.current[index].startY = e.clientY;
              }
            }}
            onMouseUp={() => {
              imageRefs.current[index] = null; // Stop dragging
            }}
            onMouseLeave={() => {
              imageRefs.current[index] = null; // Stop dragging
            }}
          >
            {/* Show icons only when hovering over the image */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                display: "none",
                "&:hover": { display: "flex" },
                flexDirection: "column",
                gap: 1,
              }}
            >
              <IconButton
                onClick={() => {
                  const updatedImages = images.filter((_, i) => i !== index);
                  setImages(updatedImages);
                }}
              >
                <Delete />
              </IconButton>
              <IconButton onClick={() => handleRotate(index, "left")}>
                <RotateLeft />
              </IconButton>
              <IconButton onClick={() => handleRotate(index, "right")}>
                <RotateRight />
              </IconButton>
              <IconButton onClick={() => handleFlip(index)}>
                <Flip />
              </IconButton>
              <IconButton onClick={() => handleResize(index, "increase")}>
                <ZoomIn />
              </IconButton>
              <IconButton onClick={() => handleResize(index, "decrease")}>
                <ZoomOut />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={downloadCollage}>
          Download Collage
        </Button>
      </Box>
    </Box>
  );
};

export default ImageCollageEditor;
