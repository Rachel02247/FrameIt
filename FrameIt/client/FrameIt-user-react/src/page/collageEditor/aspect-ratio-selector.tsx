"use client"

import type React from "react"

import { Box, Typography, RadioGroup, Radio, Grid, Paper } from "@mui/material"
import { AspectRatio } from "../../types"

const aspectRatios: AspectRatio[] = [
  { id: "1:1", name: "Square (1:1)", value: 1 },
  { id: "4:3", name: "Classic (4:3)", value: 4 / 3 },
  { id: "3:4", name: "Portrait (3:4)", value: 3 / 4 },
  { id: "16:9", name: "Wide (16:9)", value: 16 / 9 },
  { id: "9:16", name: "Story (9:16)", value: 9 / 16 },
]

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio
  onChange: (ratio: AspectRatio) => void
}

export const AspectRatioSelector = ({ selectedRatio, onChange }: AspectRatioSelectorProps) => {
  const handleRatioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ratioId = event.target.value
    const ratio = aspectRatios.find((r) => r.id === ratioId)
    if (ratio) {
      onChange(ratio)
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle1" fontWeight="medium">
        Aspect Ratio
      </Typography>

      <RadioGroup value={selectedRatio.id} onChange={handleRatioChange}>
        <Grid container spacing={1}>
          {aspectRatios.map((ratio) => (
            <Grid item xs={4} key={ratio.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  textAlign: "center",
                  border: "2px solid",
                  borderColor: selectedRatio.id === ratio.id ? "primary.main" : "grey.300",
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: selectedRatio.id === ratio.id ? "primary.main" : "grey.400",
                    bgcolor: "grey.50",
                  },
                }}
                onClick={() => {
                  const selectedRatio = aspectRatios.find((r) => r.id === ratio.id)
                  if (selectedRatio) onChange(selectedRatio)
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 48, mb: 1 }}>
                  <Box
                    sx={{
                      bgcolor: "grey.300",
                      borderRadius: 0.5,
                      width: ratio.value >= 1 ? "100%" : `${ratio.value * 100}%`,
                      height: ratio.value <= 1 ? "100%" : `${100 / ratio.value}%`,
                    }}
                  />
                </Box>
                <Typography variant="caption">{ratio.name}</Typography>
                <Radio value={ratio.id} checked={selectedRatio.id === ratio.id} sx={{ display: "none" }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </Box>
  )
}
