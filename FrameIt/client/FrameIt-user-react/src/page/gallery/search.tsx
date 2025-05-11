"use client"

import type React from "react"
import { TextField, InputAdornment, Paper, Box } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"

interface SearchProps {
  searchTerm: string
  onSearch: (searchTerm: string) => void
}

export const highlightMatch = (text: string, query: string) => {
  if (!query) return text
  const regex = new RegExp(`(${query})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

const Search: React.FC<SearchProps> = ({ searchTerm, onSearch }) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    onSearch(query)
  }

  return (
    <Box sx={{ my: 3 }}>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search files and directories..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: {
              py: 0.5,
              "& fieldset": {
                border: "none",
              },
            },
          }}
        />
      </Paper>
    </Box>
  )
}

export default Search
