
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { CloudUpload } from '@mui/icons-material';
import { Box, Typography, Paper } from '@mui/material';

interface UploadZoneProps {
  onImageUpload: (file: File) => void;
  className?: string;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageUpload, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragging(false);
    
    if (acceptedFiles.length === 0) {
      toast.error('Please upload a valid image file');
      return;
    }
    
    const file = acceptedFiles[0];
    
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    
    onImageUpload(file);
    toast.success('Image uploaded successfully');
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  return (
    <Paper
      {...getRootProps()} 
      variant="outlined" 
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        borderStyle: 'dashed',
        borderColor: isDragActive ? 'primary.main' : 'divider',
        borderWidth: 2,
        borderRadius: 1,
        transition: 'all 0.3s',
        '&:hover': {
          borderColor: 'primary.light',
          cursor: 'pointer'
        },
        animation: 'fade-in 0.3s ease-in-out'
      }}
    >
      <input {...getInputProps()} />
      <CloudUpload 
        sx={{ 
          width: 48, 
          height: 48, 
          mb: 2,
          color: 'primary'
        }} 
      />
      <Typography variant="body2" color="secondaryr" sx={{ mb: 1 }}>
        Drag & drop an image here, or click to select
      </Typography>
      <Typography variant="caption" color="secondary" align="center">
        Supports: JPG, PNG, GIF, WEBP
      </Typography>
    </Paper>
  );
};

export default UploadZone;