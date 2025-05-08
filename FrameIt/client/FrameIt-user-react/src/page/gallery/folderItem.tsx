// // FolderItem.tsx
// import React, {  } from 'react';
// import { Box, Typography, IconButton } from '@mui/material';
// import FolderIcon from '@mui/icons-material/Folder';
// import DownloadIcon from '@mui/icons-material/Download';
// import ShareIcon from '@mui/icons-material/Share';
// import DeleteIcon from '@mui/icons-material/Delete';

// interface FolderItemProps {
//   folder: { id: string; name: string };
//   onClick: () => void;
//   onDelete: () => void;
// }

// const FolderItem: React.FC<FolderItemProps> = ({ folder, onClick, onDelete }) => {

//   // const [query, setQuery] = useState('');
//   // useEffect(()=>{
//   //   setQuery(highlightMatch(folder.name))
//   // }, [query]);

//   return (
//     <Box
//       onClick={onClick}
//       sx={{
//         cursor: 'pointer',
//         backgroundColor: '#fff',
//         borderRadius: 2,
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//         padding: 2,
//         width: 170, // רוחב מלא
//         // aspectRatio: '1', // יחס גובה-רוחב אחיד (ריבוע)
//         height: 170, // גובה גמיש לפי התוכן, אבל יש שימור של היחס

//         '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' },
//       }}
//     >
//       <FolderIcon sx={{ fontSize: 60, color: '#f1c40f',}} />
//       <Typography variant="subtitle1" align="center">
//         {folder.name}
//       </Typography>
//       <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: 1}}>
//         <IconButton sx={{ color: '#1976d2' }} >
//           <DownloadIcon />
//         </IconButton>
//         <IconButton sx={{ color: '#1976d2' }}>
//           <ShareIcon />
//         </IconButton>
//         <IconButton onClick={onDelete} sx={{ color: '#d32f2f' }}>
//           <DeleteIcon />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// };

// export default FolderItem;

"use client"

import type React from "react"
import { Typography, IconButton, Paper, Tooltip, Stack } from "@mui/material"
import FolderIcon from "@mui/icons-material/Folder"
import DownloadIcon from "@mui/icons-material/Download"
import ShareIcon from "@mui/icons-material/Share"
import DeleteIcon from "@mui/icons-material/Delete"
import { downloadFile } from "../../hooks/download"

interface FolderItemProps {
  folder: { id: string; name: string }
  onClick: () => void
  onDelete: () => void
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onClick, onDelete }) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  const handleDownload = () => {
    downloadFile(folder.id, folder.name);
  }
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
          // color: "primary.main",
          opacity: 0.8,
          mb: 1,
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
          zIndex : 3,
          "&:hover": {
            opacity: 1,
          },
        }}
      >
        <Tooltip title="Download">
          <IconButton onClick={handleDownload} size="small" sx={{ color: "primary.main" }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share">
          <IconButton size="small" sx={{ color: "primary.main" }}>
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={handleDeleteClick}
            sx={{
              color: "error.main",
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
