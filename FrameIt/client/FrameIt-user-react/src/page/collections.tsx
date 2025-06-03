/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import {
  Grid,
  Paper,
  Typography,
  ImageListItem,
  ImageList,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Card,
  CardActionArea,
  CardContent,
  Fade,
  Chip,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Container,
  Button,
} from "@mui/material"
import CollectionsIcon from "@mui/icons-material/Collections"
import AddIcon from "@mui/icons-material/Add"
import SortAscendingIcon from "@mui/icons-material/ArrowUpward"
import SortDescendingIcon from "@mui/icons-material/ArrowDownward"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import FolderIcon from "@mui/icons-material/Folder"
import RefreshIcon from "@mui/icons-material/Refresh"
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserCollections, fetchCollectionFiles, setSelectedTag, sortFiles } from "../component/global-states/tagSlice"
import type { AppDispatch, RootState } from "../component/global-states/store"
import CreateCollection from "../hooks/createCollection"
import ImagePreviewModal from "../hooks/imagePreviewModal"
import LoadingIndicator from "../hooks/loadingIndicator"
import FileItem from "./gallery/fileItem"
import { getFileDownloadUrl } from "../component/global-states/fileSlice"

const Collections: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const userId = useSelector((state: RootState) => state.user.user?.id)
  const { collections, files, selectedTagId, loading } = useSelector((state: RootState) => state.tags)

  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const [openCreateCollection, setOpenCreateCollection] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isMedium = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    if (userId) dispatch(fetchUserCollections(userId))
  }, [userId, dispatch])

  useEffect(() => {
    if (selectedTagId !== 0) dispatch(fetchCollectionFiles(selectedTagId))
  }, [selectedTagId, dispatch])

  // פונקציה שמחזירה את ה-url (לא משנה סטייט)
  const getFileUrl = async (file: { s3Key: string; downloadUrl?: string }) => {
    if (file.downloadUrl) {
      return file.downloadUrl
    }
    try {
      const url = await dispatch(getFileDownloadUrl(file.s3Key)).unwrap()
      return url
    } catch (error) {
      console.error("Failed to fetch image URL:", error)
      return null
    }
  }

  // שימוש ב-useMemo כדי ליצור מערך filesWithUrls
  const filesWithUrls = useMemo(() => {
    return files.map((file) => ({
      ...file,
      // אם יש downloadUrl השתמש בו, אחרת undefined (הקומפוננטה FileItem תטפל בזה)
      downloadUrl: file.downloadUrl,
    }))
  }, [files])

  const handleTagSelect = (tagId: number) => dispatch(setSelectedTag(tagId))
  const handleOpenPreview = (fileId: string) => {
    const index = files.findIndex((file) => file.id === fileId)
    if (index !== -1) setSelectedFileIndex(index)
  }
  const handleClosePreview = () => setSelectedFileIndex(null)
  const handleNext = () =>
    selectedFileIndex !== null && selectedFileIndex < files.length - 1 && setSelectedFileIndex(selectedFileIndex + 1)
  const handlePrev = () =>
    selectedFileIndex !== null && selectedFileIndex > 0 && setSelectedFileIndex(selectedFileIndex - 1)
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  const handleSortChange = (order: "asc" | "desc") => {
    dispatch(sortFiles(order))
    handleMenuClose()
  }
  const handleRefreshFiles = () => selectedTagId !== 0 && dispatch(fetchCollectionFiles(selectedTagId))

  const getColumnCount = () => {
    if (isMobile) return 2
    if (isMedium) return 3
    return 4
  }

  const selectedCollection = collections.find((collection) => collection.id === selectedTagId)

  return (
    <Container
      sx={{
        width: "1000px",
        maxWidth: "90%",
        top: 20,
        right: 0,
        position: "relative",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          minHeight: "80vh",
          mt: 4,
          mb: 4,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg,rgb(56, 57, 58),rgb(31, 31, 31))",
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {selectedTagId !== 0 && (
              <Tooltip title="Back to Collections">
                <IconButton
                  onClick={() => dispatch(setSelectedTag(0))}
                  sx={{
                    color: "primary.main",
                    bgcolor: "action.hover",
                    "&:hover": {
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            )}
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {selectedTagId === 0 ? (
                <>
                  <CollectionsIcon sx={{ color: "primary.main" }} />
                  My Collections
                </>
              ) : (
                <>
                  <FolderIcon sx={{ color: "primary.main" }} />
                  {selectedCollection?.name || "Collection"}
                </>
              )}
            </Typography>
          </Box>

          <Box display="flex" gap={1}>
            {selectedTagId !== 0 && (
              <Tooltip title="Refresh Files">
                <IconButton
                  onClick={handleRefreshFiles}
                  sx={{
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}

            <Button
              variant="contained"
              startIcon={<CreateNewFolderIcon />}
              onClick={() => setOpenCreateCollection(true)}
              size="small"
            >
              New Collection
            </Button>

            <Tooltip title="Options">
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              minWidth: 180,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setOpenCreateCollection(true)
              handleMenuClose()
            }}
          >
            <ListItemIcon>
              <AddIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>Create Collection</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={() => handleSortChange("asc")}>
            <ListItemIcon>
              <SortAscendingIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sort Ascending</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleSortChange("desc")}>
            <ListItemIcon>
              <SortDescendingIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sort Descending</ListItemText>
          </MenuItem>
        </Menu>

        <CreateCollection
          open={openCreateCollection}
          onClose={() => setOpenCreateCollection(false)}
          fetchData={() => userId && dispatch(fetchUserCollections(userId))}
        />


        {loading ? (
          <LoadingIndicator />
        ) : selectedTagId === 0 ? (
          collections?.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
                gap: 2,
              }}
            >
              <CollectionsIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" align="center">
                No collections yet
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateCollection(true)}
                sx={{ mt: 2 }}
              >
                Create Your First Collection
              </Button>
            </Box>
          ) : (
            <Fade in={!loading}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    Your Collections
                  </Typography>
                  <Chip label={collections.length} size="small" sx={{ ml: 1 }} color="primary" />
                </Box>

                <Grid container spacing={3}>
                  {collections.map((tag) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={tag.id}>
                      <Card
                        sx={{
                          boxShadow: 2,
                          borderRadius: 3,
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
                            backgroundColor: (theme) => theme.palette.primary.main,
                            opacity: 0.7,
                          },
                        }}
                      >
                        <CardActionArea
                          onClick={() => handleTagSelect(tag.id)}
                          sx={{
                            p: 2,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <CollectionsIcon
                            sx={{
                              fontSize: 60,
                              color: "primary.main",
                              opacity: 0.8,
                              mb: 2,
                            }}
                          />
                          <CardContent sx={{ width: "100%", p: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "medium",
                                textAlign: "center",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {tag.name}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )
        ) : files.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 2,
            }}
          >
            <CollectionsIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" align="center">
              No files in this collection
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Add files to this collection from your gallery
            </Typography>
          </Box>
        ) : (
          <Fade in={!loading}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Files in Collection
                </Typography>
                <Chip label={files.length} size="small" sx={{ ml: 1 }} color="primary" />
              </Box>

              <ImageList variant="standard" cols={getColumnCount()} gap={16}>
                {filesWithUrls.map((file) => (
                  <ImageListItem key={file.id}>
                    <FileItem
                      file={file}
                      onDelete={handleRefreshFiles}
                      onOpenPreview={handleOpenPreview}
                    />
                  </ImageListItem>
                ))}
              </ImageList>


            </Box>
          </Fade>
        )}

        {selectedFileIndex !== null && files[selectedFileIndex] && (
          <ImagePreviewModal
            file={files[selectedFileIndex]}
            onClose={handleClosePreview}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={selectedFileIndex < files.length - 1}
            hasPrev={selectedFileIndex > 0}
          />
        )}
      </Paper>
    </Container>
  )
}

export default Collections
