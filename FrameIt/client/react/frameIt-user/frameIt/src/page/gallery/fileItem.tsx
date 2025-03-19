// FileItem.tsx
import React from 'react';
import { ImageListItem, ImageListItemBar, IconButton, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';

interface FileItemProps {
  file: { id: string; name: string; fileType: string };
  onDelete: () => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, onDelete }) => {
  return (
    <ImageListItem
      sx={{
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' },
      }}
    >
      <img
        src={`https://your-s3-bucket-url/${file.name}.${file.fileType}`} // שימוש ב-s3Key
        alt={file.name}
        loading="lazy"
        style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
      />
      <ImageListItemBar
        title={file.name}
        actionIcon={
          <Box>
            <IconButton sx={{ color: 'white' }}>
              <DownloadIcon />
            </IconButton>
            <IconButton sx={{ color: 'white' }}>
              <ShareIcon />
            </IconButton>
            <IconButton sx={{ color: 'white' }} onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        }
      />
    </ImageListItem>
  );
};

export default FileItem;
