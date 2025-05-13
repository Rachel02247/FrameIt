"use client"

import type React from "react"
import { Typography, IconButton, Paper, Tooltip, Stack } from "@mui/material"
import FolderIcon from "@mui/icons-material/Folder"
import DownloadIcon from "@mui/icons-material/Download"
import DeleteIcon from "@mui/icons-material/Delete"
import { downloadFile } from "../../hooks/download"
import { useLanguage } from "../../context/LanguageContext";

interface FolderItemProps {
  folder: { id: string; name: string }
  onClick: () => void
  onDelete: () => void
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onClick, onDelete }) => {
  const { language } = useLanguage();
  const translations = {
    en: {
      download: "Download",
      delete: "Delete",
    },
    he: {
      download: "הורד",
      delete: "מחק",
    },
  };

  const t = translations[language];

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    // if (window.confirm(language === "he" ? "האם אתה בטוח שברצונך למחוק תקיה זו?" : "Are you sure you want to delete this folder?")) {
      onDelete();
    // }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadFile(folder.id, folder.name, "");
  };

  return (
    <Paper
      onClick={onClick}
      elevation={2}
      sx={{
        cursor: "pointer",
        borderRadius: 2,
        width: 170,
        height: 170,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
        },
        position: "relative",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          backgroundColor: "primary.main",
          opacity: 0.7,
        },
      }}
    >
      <FolderIcon
        sx={{
          fontSize: 60,
          opacity: 0.8,
          mb: 1,
          zIndex: 3,
        }}
      />

      <Typography
        variant="subtitle1"
        align="center"
        sx={{
          fontWeight: "medium",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
          whiteSpace: "nowrap",
        }}
      >
        {folder.name}
      </Typography>

      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          mt: 1,
          opacity: 0.8,
          zIndex: 3,
          "&:hover": {
            opacity: 1,
          },
        }}
      >
        <Tooltip title={t.download}>
          <IconButton onClick={handleDownload} size="small" sx={{ color: "primary.main", zIndex: 4 }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={t.delete}>
          <IconButton
            size="small"
            onClick={handleDeleteClick}
            sx={{
              color: "error.main",
              zIndex: 4,
              "&:hover": {
                backgroundColor: "error.light",
                color: "error.dark",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  )
}

export default FolderItem
