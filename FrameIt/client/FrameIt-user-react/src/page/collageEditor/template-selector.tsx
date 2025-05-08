"use client"

import type React from "react"

import { useState } from "react"
import { Box, Typography, RadioGroup, Radio, Grid, Paper } from "@mui/material"
import type { Template } from "../../types"

// Define template thumbnails
const templates: Template[] = [
  {
    id: "grid-2x2",
    name: "Grid 2x2",
    layout: [
      { x: 0, y: 0, width: 0.5, height: 0.5 },
      { x: 0.5, y: 0, width: 0.5, height: 0.5 },
      { x: 0, y: 0.5, width: 0.5, height: 0.5 },
      { x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
    ],
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "grid-3x3",
    name: "Grid 3x3",
    layout: [
      { x: 0, y: 0, width: 0.33, height: 0.33 },
      { x: 0.33, y: 0, width: 0.33, height: 0.33 },
      { x: 0.66, y: 0, width: 0.33, height: 0.33 },
      { x: 0, y: 0.33, width: 0.33, height: 0.33 },
      { x: 0.33, y: 0.33, width: 0.33, height: 0.33 },
      { x: 0.66, y: 0.33, width: 0.33, height: 0.33 },
      { x: 0, y: 0.66, width: 0.33, height: 0.33 },
      { x: 0.33, y: 0.66, width: 0.33, height: 0.33 },
      { x: 0.66, y: 0.66, width: 0.33, height: 0.33 },
    ],
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "horizontal-3",
    name: "Horizontal 3",
    layout: [
      { x: 0, y: 0, width: 0.33, height: 1 },
      { x: 0.33, y: 0, width: 0.33, height: 1 },
      { x: 0.66, y: 0, width: 0.33, height: 1 },
    ],
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "vertical-3",
    name: "Vertical 3",
    layout: [
      { x: 0, y: 0, width: 1, height: 0.33 },
      { x: 0, y: 0.33, width: 1, height: 0.33 },
      { x: 0, y: 0.66, width: 1, height: 0.33 },
    ],
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "featured",
    name: "Featured Image",
    layout: [
      { x: 0.25, y: 0, width: 0.5, height: 0.5 },
      { x: 0, y: 0, width: 0.25, height: 0.25 },
      { x: 0, y: 0.25, width: 0.25, height: 0.25 },
      { x: 0.75, y: 0, width: 0.25, height: 0.25 },
      { x: 0.75, y: 0.25, width: 0.25, height: 0.25 },
      { x: 0, y: 0.5, width: 0.33, height: 0.5 },
      { x: 0.33, y: 0.5, width: 0.33, height: 0.5 },
      { x: 0.66, y: 0.5, width: 0.33, height: 0.5 },
    ],
    thumbnail: "/placeholder.svg?height=80&width=80",
  },
]

interface TemplateSelectorProps {
  onSelect: (template: Template) => void
}

export const TemplateSelector = ({ onSelect }: TemplateSelectorProps) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")

  const handleTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const templateId = event.target.value
    setSelectedTemplateId(templateId)
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      onSelect(template)
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle1" fontWeight="medium">
        Collage Templates
      </Typography>

      <RadioGroup value={selectedTemplateId} onChange={handleTemplateChange}>
        <Grid container spacing={1}>
          {templates.map((template) => (
            <Grid item xs={4} key={template.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  textAlign: "center",
                  border: "2px solid",
                  borderColor: selectedTemplateId === template.id ? "primary.main" : "grey.300",
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: selectedTemplateId === template.id ? "primary.main" : "grey.400",
                    bgcolor: "grey.50",
                  },
                }}
                onClick={() => {
                  setSelectedTemplateId(template.id)
                  const selectedTemplate = templates.find((t) => t.id === template.id)
                  if (selectedTemplate) onSelect(selectedTemplate)
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                  <Box sx={{ width: 64, height: 64, bgcolor: "grey.100", borderRadius: 1, position: "relative" }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "grey.200",
                        borderRadius: 1,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {template.id === "grid-2x2" && (
                        <>
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "50%",
                              height: "50%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              width: "50%",
                              height: "50%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              width: "50%",
                              height: "50%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                              width: "50%",
                              height: "50%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                        </>
                      )}
                      {template.id === "grid-3x3" && (
                        <>
                          {[...Array(9)].map((_, i) => {
                            const row = Math.floor(i / 3)
                            const col = i % 3
                            return (
                              <Box
                                key={i}
                                sx={{
                                  position: "absolute",
                                  top: `${row * 33.33}%`,
                                  left: `${col * 33.33}%`,
                                  width: "33.33%",
                                  height: "33.33%",
                                  border: "1px solid white",
                                  bgcolor: "grey.300",
                                }}
                              />
                            )
                          })}
                        </>
                      )}
                      {template.id === "horizontal-3" && (
                        <>
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "33.33%",
                              height: "100%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: "33.33%",
                              width: "33.33%",
                              height: "100%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              width: "33.33%",
                              height: "100%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                        </>
                      )}
                      {template.id === "vertical-3" && (
                        <>
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "33.33%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: "33.33%",
                              left: 0,
                              width: "100%",
                              height: "33.33%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              width: "100%",
                              height: "33.33%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                        </>
                      )}
                      {template.id === "featured" && (
                        <>
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: "25%",
                              width: "50%",
                              height: "50%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "25%",
                              height: "25%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: "25%",
                              left: 0,
                              width: "25%",
                              height: "25%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              width: "25%",
                              height: "25%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: "25%",
                              right: 0,
                              width: "25%",
                              height: "25%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              width: "33.33%",
                              height: "50%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: "33.33%",
                              width: "33.33%",
                              height: "50%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                              width: "33.33%",
                              height: "50%",
                              border: "1px solid white",
                              bgcolor: "grey.300",
                            }}
                          />
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Typography variant="caption">{template.name}</Typography>
                <Radio value={template.id} checked={selectedTemplateId === template.id} sx={{ display: "none" }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </Box>
  )
}
