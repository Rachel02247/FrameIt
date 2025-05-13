"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Paper,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Fade,
} from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download"
import DeleteIcon from "@mui/icons-material/Delete"
import CollectionsIcon from "@mui/icons-material/Collections"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useSelector, useDispatch } from "react-redux"
import type { AppDispatch, RootState } from "../../component/global-states/store"
import { fetchUserCollections, addFileToCollection } from "../../component/global-states/tagSlice"
import CreateCollection from "../../hooks/createCollection"
import { downloadByUrl, downloadFile } from "../../hooks/download"
import type { FileItemProps } from "../../types"
import { useLanguage } from "../../context/LanguageContext"
import { getFileDownloadUrl } from "../../component/global-states/fileSlice"

// Function to get file preview URL from server


const FileItem: React.FC<FileItemProps> = ({ file, onDelete, onOpenPreview }) => {
  const { language } = useLanguage();
  const translations = {
    en: {
      download: "Download",
      delete: "Delete",
      addToCollection: "Add to Collection",
      createNewCollection: "Create New Collection",
    },
    he: {
      download: "הורד",
      delete: "מחק",
      addToCollection: "הוסף לאוסף",
      createNewCollection: "צור אוסף חדש",
    },
  };

  const t = translations[language];

  const [presignedUrl, setPresignedUrl] = useState("")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [openCreateCollection, setOpenCreateCollection] = useState(false)
  const [isLoading, setIsLoading] = useState(true)


  const [, setImageError] = useState(false)


  const dispatch = useDispatch<AppDispatch>()
  const userId = useSelector((state: RootState) => state.user.user?.id)
  const tags = useSelector((state: RootState) => state.tags.collections)

  const isVideo = file.fileType.toLowerCase() === "mp4" || file.fileType.toLowerCase() === "mov"

  useEffect(() => {

    const loadFileUrl = async () => {

      setIsLoading(true)

      try {

        const result = await dispatch(getFileDownloadUrl(file.s3Key)).unwrap();
        setPresignedUrl(result);

      } catch (error) {
        
        console.error("Error loading file URL:", error)
        setImageError(true)
      
      } finally {
        setIsLoading(false)
      }
    }
    if (file.s3Key) {
      loadFileUrl();
    }
  }, [file.s3Key, dispatch])

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserCollections(userId))
    }
  }, [userId, dispatch])

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); 
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  }

  const handleOpenTagMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowTagMenu(true);
    handleCloseMenu();
  };

  const handleSelectTag = async (event: React.MouseEvent, tagId: number) => {
    event.stopPropagation(); 
    setShowTagMenu(false);
    dispatch(addFileToCollection({ fileId: file.id, tagId }));
  };

  const handleCreateNewCollection = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenCreateCollection(true);
    setShowTagMenu(false);
  };

  const handleFileClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".file-actions")) {
      onOpenPreview(file.id);
      return;
    }
    e.stopPropagation();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadFile(file.id, file.fileName, presignedUrl);
    downloadByUrl(presignedUrl, file.fileName);
    handleCloseMenu()
  }

  const handleDeleteFile = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onDelete()
    handleCloseMenu()
  }

  return (
    <Paper
      elevation={2}
      onClick={handleFileClick}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        width: 200,
        height: 200,
        position: "relative",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
        },
        cursor: "pointer",
        "&:hover .file-actions": {
          opacity: 1,
        },
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "grey.100",
          }}
        >
          <CircularProgress size={40} color="primary" />
        </Box>
      ) : isVideo ? (
        <video
          controls
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setImageError(true)}
        >
          <source src={presignedUrl} type={`video/${file.fileType}`} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Box
          component="img"
          src={presignedUrl}
          alt={file.fileName}
          loading="lazy"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={() => setImageError(true)}
        />
      )}

      <Fade in={true}>
        <Box
          className="file-actions"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: 1,
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <Tooltip title="More options">
            <IconButton
              onClick={handleOpenMenu}
              sx={{
                bgcolor: "rgba(255,255,255,0.9)",
                "&:hover": {
                  bgcolor: "white",
                },
              }}
              size="small"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Fade>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t.download}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDeleteFile}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary={t.delete} primaryTypographyProps={{ color: "error" }} />
        </MenuItem>

        <MenuItem onClick={(event) => handleOpenTagMenu(event)}>
          <ListItemIcon>
            <CollectionsIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>{t.addToCollection}</ListItemText>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={anchorEl}
        open={showTagMenu}
        onClose={() => setShowTagMenu(false)}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        {tags.map((tag) => (
          <MenuItem key={tag.id} onClick={(event) => handleSelectTag(event, tag.id)}>
            <ListItemIcon>
              <CollectionsIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>{tag.name}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={(event) => handleCreateNewCollection(event)}>
          <ListItemIcon>
            <AddCircleIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>{t.createNewCollection}</ListItemText>
        </MenuItem>
      </Menu>

      <CreateCollection
        open={openCreateCollection}
        onClose={() => setOpenCreateCollection(false)}
        fetchData={() => userId && dispatch(fetchUserCollections(userId))}
      />
    </Paper>
  )
}

export default FileItem
