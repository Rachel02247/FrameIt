// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Breadcrumbs, Link, ImageList, ImageListItem } from '@mui/material';
// import axios from 'axios';
// import FolderItem from './folderItem';
// import FileItem from './fileItem';
// import Search from './search';
// import LoadingIndicator from '../../hooks/loadingIndicator';
// import { Folder, MyFile } from '../../types';
// import CreateFolder from '../../hooks/createFolder';
// import FolderMenu from '../../hooks/folderMenu';
// import { RootState } from '../../global-states/store';
// import { useSelector } from 'react-redux';
// import ImagePreviewModal from '../../hooks/imagePreviewModal';

// const API_BASE_URL = 'http://localhost:5282';

// export default function Gallery() {
//   const [files, setFiles] = useState<MyFile[]>([]);
//   const [folders, setFolders] = useState<Folder[]>([]);
//   const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>([]);
//   const [currentFolder, setCurrentFolder] = useState<string | null>('0');
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const userId = useSelector((state: RootState) => state.user.user?.id);
//   const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
//   const images = ["img/nb/1.jpg", "img/nb/2.jpg", "img/nb/3.jpg", "img/nb/4.jpg"];

//   const fetchData = async (folderId: string | null = '0') => {
//     setLoading(true);
//     try {
//       const url = `${API_BASE_URL}/folders/${folderId}/contents/${userId}`;
//       const { data } = await axios.get(url);
//       setFolders(data.folders);
//       setFiles(data.files);
//       const breadcrumbRes = await axios.get(`${API_BASE_URL}/folders/${folderId}/breadcrumb`);
//       setBreadcrumb(breadcrumbRes.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData(currentFolder);
//   }, [currentFolder]);

//   const handleOpenPreview = (fileId: string) => {
//     const index = files.findIndex((file) => file.id === fileId);
//     if (index !== -1) {
//       setSelectedFileIndex(index);
//     }
//   };

//   const handleClosePreview = () => {
//     setSelectedFileIndex(null);
//   };

//   const handleNext = () => {
//     setSelectedFileIndex((prevIndex) =>
//       prevIndex !== null && prevIndex < files.length - 1 ? prevIndex + 1 : prevIndex
//     );
//   };

//   const handlePrev = () => {
//     setSelectedFileIndex((prevIndex) =>
//       prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : prevIndex
//     );
//   };

//   return (
//     <Box sx={{
//       position: 'relative', padding: 4, backgroundColor: '#ffff', minHeight: '100vh', borderRadius: 2,
//       width: 1000, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', mt: 4, ml: 'auto', mr: 'auto',
//     }}>
//       <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
//         My Gallery
//       </Typography>

//       <Search searchTerm={searchTerm} onSearch={setSearchTerm} />

//       <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ marginBottom: 3 }}>
//         <Link color={currentFolder === '0' ? 'textPrimary' : 'inherit'} onClick={() => setCurrentFolder('0')}>
//           Gallery
//         </Link>
//         {breadcrumb.map((folder) => (
//           <Link key={folder.id} onClick={() => setCurrentFolder(folder.id)}>
//             {folder.name}
//           </Link>
//         ))}
//       </Breadcrumbs>

//       <CreateFolder folderId={currentFolder ?? '0'} fetchData={fetchData} />
//       <FolderMenu />

//       {loading ? (
//         <LoadingIndicator />
//       ) : (
//         <ImageList variant="masonry" cols={4} gap={16}>
//           {folders.map((folder) => (
//             <ImageListItem key={folder.id} component="div">
//               <FolderItem folder={folder} onClick={() => setCurrentFolder(folder.id)} onDelete={function (): void {
//                 throw new Error('Function not implemented.');
//               }} />
//             </ImageListItem>
//           ))}
//           {files.map((file) => (
//             <ImageListItem key={file.id} component="div">
//               <FileItem file={file} onDelete={() => fetchData(currentFolder)} onOpenPreview={handleOpenPreview} />
//             </ImageListItem>
//           ))}

//         </ImageList>
//       )}

//       {/* מודל לתצוגת תמונה מוגדלת */}
//       {selectedFileIndex !== null && (
//         <ImagePreviewModal
//           file={files[selectedFileIndex]}
//           onClose={handleClosePreview}
//           onNext={handleNext}
//           onPrev={handlePrev}
//           hasNext={selectedFileIndex < files.length - 1}
//           hasPrev={selectedFileIndex > 0}
//         />
//       )}
//     </Box>
//   );
// }

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
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder"
import axios from "axios"
import FolderItem from "./folderItem"
import FileItem from "./fileItem"
import Search from "./search"
import LoadingIndicator from "../../hooks/loadingIndicator"
import type { Folder, MyFile } from "../../types"
import CreateFolder from "../../hooks/createFolder"
import FolderMenu from "../../hooks/folderMenu"
import type { RootState } from "../../global-states/store"
import { useSelector } from "react-redux"
import ImagePreviewModal from "../../hooks/imagePreviewModal"

const API_BASE_URL = "http://localhost:5282"

export default function Gallery() {
  const [files, setFiles] = useState<MyFile[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>("0")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const userId = useSelector((state: RootState) => state.user.user?.id)
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isMedium = useMediaQuery(theme.breakpoints.down("md"))

  const fetchData = async (folderId: string | null = "0") => {
    setLoading(true)
    setError(null)
    try {
      const url = `${API_BASE_URL}/folders/${folderId}/contents/${userId}`
      const { data } = await axios.get(url)
      setFolders(data.folders)
      setFiles(data.files)

      const breadcrumbRes = await axios.get(`${API_BASE_URL}/folders/${folderId}/breadcrumb`)
      setBreadcrumb(breadcrumbRes.data)
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
      prevIndex !== null && prevIndex < files.length - 1 ? prevIndex + 1 : prevIndex,
    )
  }

  const handlePrev = () => {
    setSelectedFileIndex((prevIndex) => (prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : prevIndex))
  }

  // Filter items based on search term
  const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredFiles = files.filter((file) => file.fileName.toLowerCase().includes(searchTerm.toLowerCase()))

  const getColumnCount = () => {
    if (isMobile) return 2
    if (isMedium) return 3
    return 4
  }

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          backgroundColor: "#fff",
          minHeight: "80vh",
          mt: 4,
          mb: 4,
          position: "relative",
          overflow: "hidden",
          width: "100%",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
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

          <Button
            variant="contained"
            startIcon={<CreateNewFolderIcon />}
            size="small"
            onClick={() => {
              // Trigger your create folder dialog here
              const createFolderElement = document.getElementById("create-folder-button")
              if (createFolderElement) {
                createFolderElement.click()
              }
            }}
          >
            New Folder
          </Button>
        </Box>

        <Box sx={{ display: "none" }}>
          <CreateFolder folderId={currentFolder ?? "0"} fetchData={fetchData} />
          <FolderMenu />
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
                            <FolderItem
                              folder={folder}
                              onClick={() => setCurrentFolder(folder.id)}
                              onDelete={() => {
                                // Implement folder deletion
                                console.log("Delete folder:", folder.id)
                              }}
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
                            <FileItem
                              file={file}
                              onDelete={() => fetchData(currentFolder)}
                              onOpenPreview={handleOpenPreview}
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

        {/* Image preview modal */}
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
