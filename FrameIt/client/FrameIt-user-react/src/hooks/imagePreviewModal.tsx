import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getFileDownloadUrl } from '../services/filesService';
import { getS3Url } from './aws';

interface ImagePreviewModalProps {
  file: {
    fileType: string;
    fileName: string;
    s3Key: string;
    id: string;
  };
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ file, onClose, onNext, onPrev, hasNext, hasPrev }) => {
  const isVideo = file.fileType.toLowerCase() === 'mp4' || file.fileType.toLowerCase() === 'mov';
  const [presignedUrl, setPresignedUrl] = React.useState<string | null>(null);
  const [s3ImgUrl, setS3ImgUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadFileUrl = async () => {
      try {
        const url = await getFileDownloadUrl(file.id);
         const s3Url = await getFileDownloadUrl(file.s3Key) || getS3Url(file.s3Key);
        setPresignedUrl(url);
        setS3ImgUrl(s3Url);
      } catch (error) {
        console.error('Error loading file URL:', error);
      }
    };
    loadFileUrl();
  }, [file.id]);

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
        }}
      >
        {hasPrev && (
          <IconButton sx={{ position: 'absolute', left: 16, color: '#fff' }} onClick={onPrev}>
            <ArrowBackIosIcon />
          </IconButton>
        )}

        {isVideo ? (
          <video controls src={s3ImgUrl ?? presignedUrl ?? "img/frameItLogo.png"} style={{ maxHeight: '80vh' }} />
        ) : (
          <img src={s3ImgUrl ?? presignedUrl ?? "img/frameItLogo.png"} alt={file.fileName} style={{ maxHeight: '80vh' }} />
        )}

        {hasNext && (
          <IconButton sx={{ position: 'absolute', right: 16, color: '#fff' }} onClick={onNext}>
            <ArrowForwardIosIcon />
          </IconButton>
        )}

        <IconButton sx={{ position: 'absolute', top: 16, right: 16, color: '#fff' }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default ImagePreviewModal;
