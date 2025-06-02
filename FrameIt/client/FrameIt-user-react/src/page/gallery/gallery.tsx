/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  ImageList,
  ImageListItem,
  Paper,
  Container,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  Alert,
  Fade,
} from "@mui/material"
import HomeIcon from "@mui/icons-material/Home"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import FolderItem from "./folderItem"
import FileItem from "./fileItem"
import Search from "./search"
import LoadingIndicator from "../../hooks/loadingIndicator"
import type { Folder, MyFile } from "../../types"
import CreateFolder from "../../hooks/createFolder"
import ImagePreviewModal from "../../hooks/imagePreviewModal"
import { deleteFolder, fetchDataByUserIdAndFolderId, fetchFolderByCurrentFolder, fetchFoldersBreadcrumbs, fetchFoldersByUserId } from "../../services/folderService"
import { deleteFile } from "../../component/global-states/fileSlice"


const Gallery = () => {

  const [files, setFiles] = useState<MyFile[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>("0")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const [openCreateFolder, setOpenCreateFolder] = useState<boolean>(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isMedium = useMediaQuery(theme.breakpoints.down("md"))

  const userId = sessionStorage.getItem("id") || "0"

  const fetchData = async (folderId: string | null = "0") => {

    setLoading(true)
    setError(null)
    try {

      const data = await fetchDataByUserIdAndFolderId(folderId ? parseInt(folderId) : 0, parseInt(userId))

      setFiles(data.files);
      setFolders(data.folders);
      // const FolderData = await fetchFoldersByUserId(parseInt(userId))
      // setFolders(FolderData.filter((curfolder: Folder) => curfolder.parentFolderId === folderId || (!curfolder.parentFolderId && folderId === "0")))

      // const FilesData = await fetchFilesByUserId(parseInt(userId))
      // setFiles(FilesData.filter((curfile: MyFile) => curfile.folderId === folderId || (!curfile.folderId && folderId === "0")))

      const breadcrumbRes = await fetchFoldersBreadcrumbs(folderId ?? "0")
      setBreadcrumb(breadcrumbRes);

    } catch (error) {

      console.error("Error fetching data:", error)
      setError("Failed to load gallery content. Please try again later.")

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(currentFolder)
  }, [currentFolder])

  const handleDelete = async (fId: string, what: string) => {
    if (window.confirm(`Are you sure you want to delete this ${what}?`)) {
      try {

        if(what === 'folder') 
          await deleteFolder(fId);

        else if (what === 'file')
           await deleteFile(fId);

        fetchData(currentFolder)

      } catch (error) {
        console.error(`Error deleting ${what}:`, error)
        setError(`Failed to delete ${what}. Please try again.`)
      }
    }
  }

  const handleOpenPreview = (fileId: string) => {
    const index = files.findIndex((file) => file.id === fileId)
    if (index !== -1) {
      setSelectedFileIndex(index)
    }
  }

  const handleClosePreview = () => {
    setSelectedFileIndex(null)
  }

  const handleNext = () => {
    setSelectedFileIndex((prevIndex) =>
      prevIndex !== null && prevIndex < files.length - 1 ? prevIndex + 1 : prevIndex
    )
  }

  const handlePrev = () => {
    setSelectedFileIndex((prevIndex) => (prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : prevIndex))
  }

  const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredFiles = files.filter((file) => file.fileName.toLowerCase().includes(searchTerm.toLowerCase()))

  const getColumnCount = () => {
    if (isMobile) return 2
    if (isMedium) return 3
    return 4
  }

  const handleCreateFolderOpen = () => {
    setOpenCreateFolder(true)
  }

  const handleCreateFolderClose = () => {
    setOpenCreateFolder(false)
  }

  return (
    <Container
      sx={{
        width: "1000px",
        maxWidth: "95%",
        top: 30,
        right: 0,
        position: "relative",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          backgroundColor: theme.palette.background.default,
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
            background: "linear-gradient(90deg,rgb(49, 48, 49),rgb(82, 82, 83))",
          },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#333",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          My Gallery
        </Typography>

        <Search searchTerm={searchTerm} onSearch={setSearchTerm} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />} aria-label="breadcrumb">
            <Link
              color={currentFolder === "0" ? "primary" : "inherit"}
              onClick={() => setCurrentFolder("0")}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
              Gallery
            </Link>
            {breadcrumb.map((folder) => (
              <Link
                key={folder.id}
                onClick={() => setCurrentFolder(folder.id)}
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                color="inherit"
              >
                {folder.name}
              </Link>
            ))}
          </Breadcrumbs>


        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            {filteredFolders.length === 0 && filteredFiles.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchTerm ? "No results found" : "This folder is empty"}
                </Typography>
                {searchTerm && (
                  <Typography variant="body2" color="text.secondary">
                    Try a different search term or browse through folders
                  </Typography>
                )}
                {!searchTerm && (
                  <Typography variant="body2" color="text.secondary">
                    Create a new folder or upload files to get started
                  </Typography>
                )}
              </Box>
            ) : (
              <Fade in={!loading}>
                <Box>
                  {filteredFolders.length > 0 && (
                    <>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" component="h2">
                          Folders
                        </Typography>
                        <Chip label={filteredFolders.length} size="small" sx={{ ml: 1 }} color="primary" />
                      </Box>

                      <ImageList variant="standard" cols={getColumnCount()} gap={16} sx={{ mb: 4 }}>
                        {filteredFolders.map((folder) => (
                          <ImageListItem key={folder.id} component="div">
                            {/* Ensure FolderItem renders images with loading="lazy" and fallback */}
                            <FolderItem
                              folder={folder}
                              onClick={() => setCurrentFolder(folder.id)}
                              onDelete={() => handleDelete(folder.id, "folder")}
                              // If FolderItem renders <img>, add loading="lazy" and onError fallback there
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </>
                  )}

                  {filteredFiles.length > 0 && (
                    <>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" component="h2">
                          Files
                        </Typography>
                        <Chip label={filteredFiles.length} size="small" sx={{ ml: 1 }} color="primary" />
                      </Box>

                      <ImageList variant="standard" cols={getColumnCount()} gap={16}>
                        {filteredFiles.map((file) => (
                          <ImageListItem key={file.id} component="div">
                            {/* Ensure FileItem renders images with loading="lazy" and fallback */}
                            <FileItem
                              file={file}
                              onDelete={() => handleDelete(file.id, 'file')}
                              onOpenPreview={handleOpenPreview}
                              // If FileItem renders <img>, add loading="lazy" and onError fallback there
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </>
                  )}
                </Box>
              </Fade>
            )}
          </>
        )}


        <CreateFolder
          folderId={currentFolder ?? '0'}
          fetchData={fetchData}
        />


        {selectedFileIndex !== null && (
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

export default Gallery