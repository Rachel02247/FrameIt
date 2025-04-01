
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider, 
  Tooltip 
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../global-states/store';
import { fetchUserCollections, addFileToCollection } from '../../global-states/tagSlice';
import CreateCollection from '../../hooks/createCollection';
import { downloadFile } from '../../hooks/download';
import { FileItemProps } from '../../types';


const FileItem: React.FC<FileItemProps> = ({ file, onDelete, onOpenPreview }) => {
  const [presignedUrl, setPresignedUrl] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [openCreateCollection, setOpenCreateCollection] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.user?.id);
  const tags = useSelector((state: RootState) => state.tags.collections);
  
  const isVideo = file.fileType.toLowerCase() === 'mp4' || file.fileType.toLowerCase() === 'mov';

  useEffect(() => {
    const loadFileUrls = async () => {
      const previewUrl = await getFilePreviewUrl(file.s3Key);
      setPresignedUrl(previewUrl);
      
      const directUrl = await getFileDirectUrl(file.fileName);
      setImgUrl(directUrl);
    };
    
    loadFileUrls();
  }, [file.s3Key, file.fileName]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserCollections(userId));
    }
  }, [userId, dispatch]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenTagMenu = () => {
    setShowTagMenu(true);
  };

  const handleSelectTag = async (tagId: number) => {
    setShowTagMenu(false);
    dispatch(addFileToCollection({ fileId: file.id, tagId }));
  };

  const handleCreateNewCollection = () => {
    setOpenCreateCollection(true);
    setShowTagMenu(false);
  };

  const handleFileClick = () => {
    onOpenPreview(file.id);
  };

  const handleDownload = () => {
    downloadFile(file.id, file.fileName);
    handleCloseMenu();
  };

  const handleDeleteFile = () => {
    onDelete();
    handleCloseMenu();
  };

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
        position: 'relative',
        '&:hover .file-actions': {
          opacity: 1,
          visibility: 'visible',
        },
      }}
      onMouseEnter={() => setAnchorEl(null)}
      onMouseLeave={() => setAnchorEl(null)}
    >
      {isVideo ? (
        <video
          controls
          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
          onError={(e) => (e.currentTarget.style.display = 'none')}
          onClick={handleFileClick}
        >
          <source src={presignedUrl} type={`video/${file.fileType}`} />
          הדפדפן שלך אינו תומך בניגון וידאו.
        </video>
      ) : (
        <img
          src={presignedUrl || imgUrl || 'img/logo.png'}
          alt={file.fileName}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
          onError={(e) => (e.currentTarget.src = 'img/logo.png')}
          onClick={handleFileClick}
        />
      )}

      {/* Menu Button */}
      <Box
        className="file-actions"
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          opacity: 0,
          visibility: 'hidden',
          transition: 'opacity 0.3s, visibility 0.3s',
          zIndex: 10,
        }}
      >
        <Tooltip title="More options">
          <IconButton onClick={handleOpenMenu} color='primary'>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Options Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleDownload}>
          <DownloadIcon sx={{ mr: 1 }} /> Download
        </MenuItem>
        <MenuItem onClick={handleDeleteFile}>
          <DeleteIcon sx={{ mr: 1, color: 'red' }} /> Delete
        </MenuItem>
        <MenuItem onClick={handleOpenTagMenu}>
          <CollectionsIcon sx={{ mr: 1 }} /> Add to Collection
        </MenuItem>
      </Menu>

      {/* Tags Menu */}
      <Menu anchorEl={anchorEl} open={showTagMenu} onClose={() => setShowTagMenu(false)}>
        {tags.map((tag) => (
          <MenuItem key={tag.id} onClick={() => handleSelectTag(tag.id)}>
            <CollectionsIcon sx={{ mr: 1 }} /> {tag.name}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleCreateNewCollection}>
          <AddCircleIcon sx={{ mr: 1 }} /> Create New Collection
        </MenuItem>
      </Menu>

      <CreateCollection
        open={openCreateCollection}
        onClose={() => setOpenCreateCollection(false)}
        fetchData={() => userId && dispatch(fetchUserCollections(userId))}
      />
    </Box>
  );
};

export default FileItem;