// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   IconButton,
//   Menu,
//   MenuItem,
//   Divider,
//   Tooltip
// } from '@mui/material';
// import DownloadIcon from '@mui/icons-material/Download';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CollectionsIcon from '@mui/icons-material/Collections';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { useSelector, useDispatch } from 'react-redux';
// import { AppDispatch, RootState } from '../../global-states/store';
// import { fetchUserCollections, addFileToCollection } from '../../global-states/tagSlice';
// import CreateCollection from '../../hooks/createCollection';
// import { downloadFile } from '../../hooks/download';
// import { FileItemProps } from '../../types';

// // פונקציה חדשה לקריאת URL מהשרת
// const getFilePreviewUrl = async (s3Key: string): Promise<string> => {
//   const encodedKey = encodeURIComponent(s3Key);  // נוודא שה־s3Key לא מכיל תווים בעייתיים
//   const response = await fetch(`http://localhost:5282/files/generate-url?s3Key=${encodedKey}`);
  
//   if (!response.ok) {
//     throw new Error('Failed to fetch presigned URL');
//   }

//   const data = await response.json();
//   return data;  // מצפים ש־data יהיה ה־URL
// };

// const FileItem: React.FC<FileItemProps> = ({ file, onDelete, onOpenPreview }) => {
//   const [presignedUrl, setPresignedUrl] = useState('');
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [showTagMenu, setShowTagMenu] = useState(false);
//   const [openCreateCollection, setOpenCreateCollection] = useState(false);

//   const dispatch = useDispatch<AppDispatch>();
//   const userId = useSelector((state: RootState) => state.user.user?.id);
//   const tags = useSelector((state: RootState) => state.tags.collections);

//   const isVideo = file.fileType.toLowerCase() === 'mp4' || file.fileType.toLowerCase() === 'mov';

//   useEffect(() => {
//     const loadFileUrl = async () => {
//       const url = await getFilePreviewUrl(file.s3Key);
//       console.log('previewUrl:', url);
//       setPresignedUrl(url);
//     };
//     loadFileUrl();
//   }, [file.s3Key]);

//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchUserCollections(userId));
//     }
//   }, [userId, dispatch]);

//   const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//   };

//   const handleOpenTagMenu = () => {
//     setShowTagMenu(true);
//   };

//   const handleSelectTag = async (tagId: number) => {
//     setShowTagMenu(false);
//     dispatch(addFileToCollection({ fileId: file.id, tagId }));
//   };

//   const handleCreateNewCollection = () => {
//     setOpenCreateCollection(true);
//     setShowTagMenu(false);
//   };

//   const handleFileClick = () => {
//     onOpenPreview(file.id);
//   };

//   const handleDownload = () => {
//     downloadFile(file.id, file.fileName);
//     handleCloseMenu();
//   };

//   const handleDeleteFile = () => {
//     onDelete();
//     handleCloseMenu();
//   };

//   return (
//     <Box
//       sx={{
//         backgroundColor: '#fff',
//         borderRadius: 2,
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//         overflow: 'hidden',
//         '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' },
//         width: 200,
//         height: 200,
//         display: 'flex',
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         position: 'relative',
//         '&:hover .file-actions': {
//           opacity: 1,
//           visibility: 'visible',
//         },
//       }}
//     >
//       {isVideo ? (
//         <video
//           controls
//           style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
//           onError={(e) => (e.currentTarget.style.display = 'none')}
//           onClick={handleFileClick}
//         >
//           <source src={presignedUrl} type={`video/${file.fileType}`} />
//           הדפדפן שלך אינו תומך בניגון וידאו.
//         </video>
//       ) : (
//         <img
//           src={presignedUrl || 'img/logo.png'}
//           alt={file.fileName}
//           loading="lazy"
//           style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
//           onError={(e) => {
//             console.log('שגיאה בטעינת התמונה');
//             e.currentTarget.src = 'img/logo.png';
//           }}
//           onClick={handleFileClick}
//         />
//       )}

//       <Box
//         className="file-actions"
//         sx={{
//           position: 'absolute',
//           top: '10px',
//           right: '10px',
//           opacity: 0,
//           visibility: 'hidden',
//           transition: 'opacity 0.3s, visibility 0.3s',
//           zIndex: 10,
//         }}
//       >
//         <Tooltip title="More options">
//           <IconButton onClick={handleOpenMenu} color='primary'>
//             <MoreVertIcon />
//           </IconButton>
//         </Tooltip>
//       </Box>

//       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
//         <MenuItem onClick={handleDownload}>
//           <DownloadIcon sx={{ mr: 1 }} /> Download
//         </MenuItem>
//         <MenuItem onClick={handleDeleteFile}>
//           <DeleteIcon sx={{ mr: 1, color: 'red' }} /> Delete
//         </MenuItem>
//         <MenuItem onClick={handleOpenTagMenu}>
//           <CollectionsIcon sx={{ mr: 1 }} /> Add to Collection
//         </MenuItem>
//       </Menu>

//       <Menu anchorEl={anchorEl} open={showTagMenu} onClose={() => setShowTagMenu(false)}>
//         {tags.map((tag) => (
//           <MenuItem key={tag.id} onClick={() => handleSelectTag(tag.id)}>
//             <CollectionsIcon sx={{ mr: 1 }} /> {tag.name}
//           </MenuItem>
//         ))}
//         <Divider />
//         <MenuItem onClick={handleCreateNewCollection}>
//           <AddCircleIcon sx={{ mr: 1 }} /> Create New Collection
//         </MenuItem>
//       </Menu>

//       <CreateCollection
//         open={openCreateCollection}
//         onClose={() => setOpenCreateCollection(false)}
//         fetchData={() => userId && dispatch(fetchUserCollections(userId))}
//       />
//     </Box>
//   );
// };

// export default FileItem;

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

// Function to get file preview URL from server


const FileItem: React.FC<FileItemProps> = ({ file, onDelete, onOpenPreview }) => {
  const [presignedUrl, setPresignedUrl] = useState("")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [openCreateCollection, setOpenCreateCollection] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
const [urlTrick, setUrlTrick] = useState('');

  const dispatch = useDispatch<AppDispatch>()
  const userId = useSelector((state: RootState) => state.user.user?.id)
  const tags = useSelector((state: RootState) => state.tags.collections)

  const isVideo = file.fileType.toLowerCase() === "mp4" || file.fileType.toLowerCase() === "mov"

  const getFilePreviewUrl = async (s3Key: string): Promise<string> => {
    const encodedKey = encodeURIComponent(s3Key)
    console.log(s3Key);
    console.log(encodedKey);
    const url = `https://001687204140frameit.s3.us-east-1.amazonaws.com/${encodedKey}`
    console.log(url);
    setUrlTrick(url)
   
    return url
  //   const response = await axios.get(`http://localhost:5282/files/generate-url?s3Key=${encodedKey}`)
  //   // const response = await axios.get(`http://localhost:5282/files/${file.fileName}/download`)
  // console.log(response);
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch presigned URL")
  //   }
  
  //   const data = await response.json()
  //   return data
  }
  useEffect(() => {
    const loadFileUrl = async () => {
      setIsLoading(true)
      try {
        const url = await getFilePreviewUrl(file.s3Key)
        setPresignedUrl(url)
      } catch (error) {
        console.error("Error loading file URL:", error)
        setImageError(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadFileUrl()
  }, [file.s3Key])

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserCollections(userId))
    }
  }, [userId, dispatch])

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleOpenTagMenu = () => {
    setShowTagMenu(true)
    handleCloseMenu()
  }

  const handleSelectTag = async (tagId: number) => {
    setShowTagMenu(false)
    dispatch(addFileToCollection({ fileId: file.id, tagId }))
  }

  const handleCreateNewCollection = () => {
    setOpenCreateCollection(true)
    setShowTagMenu(false)
  }

  const handleFileClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onOpenPreview(file.id)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    downloadFile(file.id, file.fileName)
    downloadByUrl(urlTrick, file.fileName);
    handleCloseMenu()
  }

  const handleDeleteFile = (e: React.MouseEvent) => {
    e.stopPropagation()
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
          הדפדפן שלך אינו תומך בניגון וידאו.
        </video>
      ) : (
        <Box
          component="img"
          src={imageError ? "img/logo.png" : presignedUrl}
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
          <ListItemText>Download</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDeleteFile}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ color: "error" }} />
        </MenuItem>

        <MenuItem onClick={handleOpenTagMenu}>
          <ListItemIcon>
            <CollectionsIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Add to Collection</ListItemText>
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
          <MenuItem key={tag.id} onClick={() => handleSelectTag(tag.id)}>
            <ListItemIcon>
              <CollectionsIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>{tag.name}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleCreateNewCollection}>
          <ListItemIcon>
            <AddCircleIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Create New Collection</ListItemText>
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
