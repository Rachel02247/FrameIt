"use client"

import type React from "react"

import { forwardRef, useRef, useState, useEffect } from "react"
import { Box, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import RotateRightIcon from "@mui/icons-material/RotateRight"
import RotateLeftIcon from "@mui/icons-material/RotateLeft"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import ZoomOutIcon from "@mui/icons-material/ZoomOut"
import FlipIcon from "@mui/icons-material/Flip"
import type { CollageImage } from "../../types"

interface CollageCanvasProps {
  images: CollageImage[]
  backgroundColor: string
  width: number
  height: number
  selectedImageId: string | null
  onImageSelect: (id: string) => void
  onImageUpdate: (image: CollageImage) => void
  onImageRemove: (id: string) => void
}

interface ResizingState {
  id: string
  direction: string
}

interface ResizeStartState {
  x: number
  y: number
  width: number
  height: number
}

export const CollageCanvas = forwardRef<HTMLDivElement, CollageCanvasProps>(
  ({ images, backgroundColor, width, height, selectedImageId, onImageSelect, onImageUpdate, onImageRemove }, ref: React.Ref<HTMLDivElement>) => {
    const [draggingId, setDraggingId] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [resizing, setResizing] = useState<ResizingState | null>(null)
    const [resizeStart, setResizeStart] = useState<ResizeStartState>({ x: 0, y: 0, width: 0, height: 0 })
    const canvasRef = useRef<HTMLDivElement>(null)

    // Handle keyboard events for selected image
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!selectedImageId) return

        const selectedImage = images.find((img) => img.id === selectedImageId)
        if (!selectedImage) return

        const step = e.shiftKey ? 10 : 1
        const updatedImage = { ...selectedImage }

        switch (e.key) {
          case "ArrowLeft":
            updatedImage.x -= step
            break
          case "ArrowRight":
            updatedImage.x += step
            break
          case "ArrowUp":
            updatedImage.y -= step
            break
          case "ArrowDown":
            updatedImage.y += step
            break
          case "r":
            updatedImage.rotation = (updatedImage.rotation + 90) % 360
            break
          case "f":
            updatedImage.flipped = !updatedImage.flipped
            break
          case "Delete":
          case "Backspace":
            onImageRemove(selectedImageId)
            return
          default:
            return
        }

        e.preventDefault()
        onImageUpdate(updatedImage)
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedImageId, images, onImageUpdate, onImageRemove])

    const handleMouseDown = (e: React.MouseEvent, id: string) => {
      e.stopPropagation()

      const image = images.find((img) => img.id === id)
      if (!image) return

      onImageSelect(id)

      // Start dragging
      setDraggingId(id)

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
      if (draggingId) {
        e.preventDefault()

        const image = images.find((img) => img.id === draggingId)
        if (!image) return

        const canvasRect = canvasRef.current?.getBoundingClientRect()
        if (!canvasRect) return

        const newX = e.clientX - canvasRect.left - dragOffset.x
        const newY = e.clientY - canvasRect.top - dragOffset.y

        onImageUpdate({
          ...image,
          x: newX,
          y: newY,
        })
      } else if (resizing) {
        e.preventDefault()

        const image = images.find((img) => img.id === resizing.id)
        if (!image) return

        const canvasRect = canvasRef.current?.getBoundingClientRect()
        if (!canvasRect) return

        const deltaX = e.clientX - canvasRect.left - resizeStart.x
        const deltaY = e.clientY - canvasRect.top - resizeStart.y

        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newX = image.x
        let newY = image.y

        // Handle different resize directions
        switch (resizing.direction) {
          case "e":
            newWidth = resizeStart.width + deltaX
            break
          case "w":
            newWidth = resizeStart.width - deltaX
            newX = resizeStart.x + deltaX
            break
          case "s":
            newHeight = resizeStart.height + deltaY
            break
          case "n":
            newHeight = resizeStart.height - deltaY
            newY = resizeStart.y + deltaY
            break
          case "se":
            newWidth = resizeStart.width + deltaX
            newHeight = resizeStart.height + deltaY
            break
          case "sw":
            newWidth = resizeStart.width - deltaX
            newHeight = resizeStart.height + deltaY
            newX = resizeStart.x + deltaX
            break
          case "ne":
            newWidth = resizeStart.width + deltaX
            newHeight = resizeStart.height - deltaY
            newY = resizeStart.y + deltaY
            break
          case "nw":
            newWidth = resizeStart.width - deltaX
            newHeight = resizeStart.height - deltaY
            newX = resizeStart.x + deltaX
            newY = resizeStart.y + deltaY
            break
        }

        // Ensure minimum size
        newWidth = Math.max(50, newWidth)
        newHeight = Math.max(50, newHeight)

        onImageUpdate({
          ...image,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        })
      }
    }

    const handleMouseUp = () => {
      setDraggingId(null)
      setResizing(null)
    }

    const startResize = (e: React.MouseEvent, id: string, direction: string) => {
      e.stopPropagation()

      const image = images.find((img) => img.id === id)
      if (!image) return

      onImageSelect(id)

      setResizing({ id, direction })

      const canvasRect = canvasRef.current?.getBoundingClientRect()
      if (!canvasRect) return

      setResizeStart({
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
        width: image.width,
        height: image.height,
      })
    }

    const handleCanvasClick = () => {
      onImageSelect("")
    }

    const handleRotate = (id: string, clockwise: boolean) => {
      const image = images.find((img) => img.id === id)
      if (!image) return

      onImageUpdate({
        ...image,
        rotation: (image.rotation + (clockwise ? 90 : -90)) % 360,
      })
    }

    const handleFlip = (id: string) => {
      const image = images.find((img) => img.id === id)
      if (!image) return

      onImageUpdate({
        ...image,
        flipped: !image.flipped,
      })
    }

    const handleResize = (id: string, scale: number) => {
      const image = images.find((img) => img.id === id)
      if (!image) return

      onImageUpdate({
        ...image,
        width: image.width * scale,
        height: image.height * scale,
      })
    }

    return (
      <Box
        ref={(node: HTMLDivElement | null) => {
          // Assign the ref to both the forwarded ref and the local ref
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
          canvasRef.current = node
        }}
        sx={{
          position: "relative",
          overflow: "hidden",
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 1,
          boxShadow: 1,
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor,
          cursor: draggingId || resizing ? "grabbing" : "default",
          top: 70,
          
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {images.map((image) => {
          const isSelected = image.id === selectedImageId

          return (
            <Box
              key={image.id}
              sx={{
                position: "absolute",
                left: `${image.x}px`,
                top: `${image.y}px`,
                width: `${image.width}px`,
                height: `${image.height}px`,
                transform: `rotate(${image.rotation}deg) scaleX(${image.flipped ? -1 : 1})`,
                cursor: draggingId === image.id ? "grabbing" : "grab",
                border: isSelected ? "2px solid #1976d2" : "none",
                zIndex: isSelected ? 10 : 0,
              }}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onMouseDown={(e) => handleMouseDown(e, image.id)}
                draggable={false}
              />

              {isSelected && (
                <>
                  {/* Resize handles */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 12,
                      height: 12,
                      bgcolor: "white",
                      border: "1px solid #1976d2",
                      cursor: "nw-resize",
                    }}
                    onMouseDown={(e) => startResize(e, image.id, "nw")}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      bgcolor: "white",
                      border: "1px solid #1976d2",
                      cursor: "ne-resize",
                    }}
                    onMouseDown={(e) => startResize(e, image.id, "ne")}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: 12,
                      height: 12,
                      bgcolor: "white",
                      border: "1px solid #1976d2",
                      cursor: "sw-resize",
                    }}
                    onMouseDown={(e) => startResize(e, image.id, "sw")}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      bgcolor: "white",
                      border: "1px solid #1976d2",
                      cursor: "se-resize",
                    }}
                    onMouseDown={(e) => startResize(e, image.id, "se")}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 12,
                      height: 12,
                      bgcolor: "white",
                      border: "1px solid #1976d2",
                      cursor: "n-resize",
                    }}
                    onMouseDown={(e) => startResize(e, image.id, "n")}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 12,
                      height: 12,
                      bgcolor: "white",
                      border: "1px solid #1976d2",
                      cursor: "s-resize",
                    }}
                    onMouseDown={(e) => startResize(e, image.id, "s")}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 12,
                      height: 12,
                      bgcolor: "white",
                      border: "1px solid #1976d2",
                      cursor: "w-resize",
                    }}
                    onMouseDown={(e) => startResize(e, image.id, "w")}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 12,
                      height: 12,
                      bgcolor: "white",
                      border: "1px solid #1976d2",
                      cursor: "e-resize",
                    }}
                    onMouseDown={(e) => startResize(e, image.id, "e")}
                  />

                  {/* Image controls */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -48,
                      left: "50%",
                      transform: "translateX(-50%)" ,
                      bgcolor: "white",
                      borderRadius: 1,
                      boxShadow: 2,
                      p: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <IconButton size="small" onClick={() => handleRotate(image.id, false)}>
                      <RotateLeftIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleRotate(image.id, true)}>
                      <RotateRightIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleFlip(image.id)}>
                      <FlipIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleResize(image.id, 1.1)}>
                      <ZoomInIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleResize(image.id, 0.9)}>
                      <ZoomOutIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "error.main" }} onClick={() => onImageRemove(image.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </>
              )}
            </Box>
          )
        })}
      </Box>
    )
  },
)

CollageCanvas.displayName = "CollageCanvas"
