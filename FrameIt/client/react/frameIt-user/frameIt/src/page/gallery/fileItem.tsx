import React, { useEffect, useState } from 'react';
import { Box, ImageListItemBar, IconButton, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { downloadFile } from '../../hooks/download';
import axios from 'axios';

interface FileItemProps {
  file: {
    s3Key: string;
    fileType: string;
    fileName: string;
    id: string;
  };
  onDelete: () => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, onDelete }) => {
  const url = "http://localhost:5282/files/generate-url";
  const [presignedUrl, setPresignedUrl] = useState('');
  const [showBar, setShowBar] = useState(false);

  const isVideo = file.fileType.toLowerCase() === 'mp4' || file.fileType.toLowerCase() === 'mov';

  const getPresignedUrl = async () => {
    const encodeKey = encodeURIComponent(file.s3Key);
    console.log('encodeKey: ' + encodeKey);
    const res = await axios.get(`${url}?s3Key=${encodeKey}`);
    console.log(res);
    setPresignedUrl(res.data.url);
    console.log(presignedUrl);
  };

  useEffect(() => {
    getPresignedUrl();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' },
        width: 200,
        height: 200,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        position: 'relative'
      }}
      onMouseEnter={() => setShowBar(true)}
      onMouseLeave={() => setShowBar(false)}
    >
      {isVideo ? (
        <video
          controls
          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
          onError={(e) => (e.currentTarget.style.display = 'none')}
        >
          <source src={presignedUrl} type={`video/${file.fileType}`} />
          הדפדפן שלך אינו תומך בניגון וידאו.
        </video>
      ) : (
        <img
          src={presignedUrl ?? 'img/logo.png'}
          alt={file.fileName}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
          onError={(e) => (e.currentTarget.src = 'img/logo.png')}
        />
      )}

      {showBar && (
        <ImageListItemBar
          sx={{
            bgcolor: 'transparent',
            width: '100%',
            position: 'absolute',
            bottom: 0,
            borderRadius: '0 0 8px 8px'
          }}
          title={file.fileName}
          actionIcon={
            <Box>
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', fontWeight: 'bold', color: 'grey' }}>
                {file.fileName}
              </Typography>
              <IconButton color='secondary' onClick={() => downloadFile(file.id, file.fileName)}>
                <DownloadIcon />
              </IconButton>
              <IconButton color='secondary' onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Box>
          }
        />
      )}
    </Box>
  );
};

export default FileItem;
