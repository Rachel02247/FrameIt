"use client"

import type React from "react"

import { useState } from "react"
<<<<<<< HEAD
import { Box, Typography, Button, Popover, Grid } from "@mui/material"
=======
import { Box, Typography, Button, Popover, Grid, TextField, MenuItem } from "@mui/material"
>>>>>>> clean-dev
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import CheckIcon from "@mui/icons-material/Check"

const predefinedColors = [
  "#ffffff", // White
  "#f8f9fa", // Light gray
  "#e9ecef", // Lighter gray
  "#dee2e6", // Light blue gray
  "#ced4da", // Blue gray
  "#adb5bd", // Gray
  "#6c757d", // Dark gray
  "#495057", // Darker gray
  "#343a40", // Very dark gray
  "#212529", // Almost black
  "#000000", // Black
  "#f8f9d7", // Light yellow
  "#e3f2fd", // Light blue
  "#ffebee", // Light red
  "#f3e5f5", // Light purple
  "#e8f5e9", // Light green
]

<<<<<<< HEAD
=======
const fonts = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Comic Sans MS",
]

>>>>>>> clean-dev
interface BackgroundColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export const BackgroundColorPicker = ({ color, onChange }: BackgroundColorPickerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
<<<<<<< HEAD
=======
  const [text, setText] = useState<string>("")
  const [font, setFont] = useState<string>("Arial")
  const [textColor, setTextColor] = useState<string>("#000000")
>>>>>>> clean-dev
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleColorSelect = (selectedColor: string) => {
    onChange(selectedColor)
    handleClose()
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle1" fontWeight="medium">
        Background Color
      </Typography>

      <Button
        variant="outlined"
        fullWidth
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          justifyContent: "space-between",
          backgroundColor: color,
          color: isLightColor(color) ? "#000000" : "#ffffff",
          borderColor: "grey.300",
          "&:hover": {
            borderColor: "grey.400",
            backgroundColor: color,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "1px solid",
              borderColor: "grey.300",
              backgroundColor: color,
            }}
          />
          <Typography variant="body2">{color.toUpperCase()}</Typography>
        </Box>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2, width: 280 }}>
          <Grid container spacing={1}>
            {predefinedColors.map((c) => (
              <Grid item key={c} xs={3}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "grey.300",
                    backgroundColor: c,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => handleColorSelect(c)}
                >
                  {c === color && <CheckIcon sx={{ fontSize: 16, color: isLightColor(c) ? "#000000" : "#ffffff" }} />}
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Custom Color
            </Typography>
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              style={{ width: "100%", height: 32, padding: 0, border: "none" }}
            />
          </Box>
        </Box>
      </Popover>
<<<<<<< HEAD
=======

      <Typography variant="subtitle1" fontWeight="medium">
        Add Text
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter your text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Typography variant="subtitle1" fontWeight="medium">
        Select Font
      </Typography>
      <TextField
        select
        fullWidth
        variant="outlined"
        value={font}
        onChange={(e) => setFont(e.target.value)}
      >
        {fonts.map((fontOption) => (
          <MenuItem key={fontOption} value={fontOption}>
            {fontOption}
          </MenuItem>
        ))}
      </TextField>
      <Typography variant="subtitle1" fontWeight="medium">
        Text Color
      </Typography>
      <input
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
        style={{ width: "100%", height: 32, padding: 0, border: "none" }}
      />
>>>>>>> clean-dev
    </Box>
  )
}

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  // Convert hex to RGB
  const hex = color.replace("#", "")
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)

  // Calculate brightness (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 128
}
