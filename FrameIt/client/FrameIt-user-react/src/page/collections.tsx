
import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Chip, 
  Paper, 
  Typography, 
  ImageListItem, 
  ImageList, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Tooltip 
} from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddIcon from '@mui/icons-material/Add';
import SortAscendingIcon from '@mui/icons-material/ArrowUpward';
import SortDescendingIcon from '@mui/icons-material/ArrowDownward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUserCollections, 
  fetchCollectionFiles, 
  setSelectedTag, 
  sortFiles 
}from '../global-states/tagSlice'
import { AppDispatch, RootState } from '../global-states/store';
import CreateCollection from '../hooks/createCollection';
import ImagePreviewModal from '../hooks/imagePreviewModal';
import LoadingIndicator from '../hooks/loadingIndicator';
import FileItem from './gallery/fileItem';
const Collections: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.user?.id);
  const { collections, files, selectedTagId, loading } = useSelector((state: RootState) => state.tags);
  
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [openCreateCollection, setOpenCreateCollection] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Initial data loading
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserCollections(userId));
    }
  }, [userId, dispatch]);

  // Load files when tag is selected
  useEffect(() => {
    if (selectedTagId !== 0) {
      dispatch(fetchCollectionFiles(selectedTagId));
    }
  }, [selectedTagId, dispatch]);

  const handleTagSelect = (tagId: number) => {
    dispatch(setSelectedTag(tagId));
  };

  const handleOpenPreview = (fileId: string) => {
    const index = files.findIndex((file) => file.id === fileId);
    if (index !== -1) {
      setSelectedFileIndex(index);
    }
  };

  const handleClosePreview = () => {
    setSelectedFileIndex(null);
  };

  const handleNext = () => {
    if (selectedFileIndex !== null && selectedFileIndex < files.length - 1) {
      setSelectedFileIndex(selectedFileIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedFileIndex !== null && selectedFileIndex > 0) {
      setSelectedFileIndex(selectedFileIndex - 1);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
    dispatch(sortFiles(order));
    handleMenuClose();
  };

  const handleRefreshFiles = () => {
    if (selectedTagId !== 0) {
      dispatch(fetchCollectionFiles(selectedTagId));
    }
  };

  return (
    <Paper
      sx={{
        position: 'relative', 
        padding: 4, 
        backgroundColor: '#ffff', 
        minHeight: '100vh',
        width: 1000, 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        mt: 4, 
        ml: 'auto', 
        mr: 'auto',
        zIndex: 1
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        My Collections
      </Typography>

      {/* Options Menu Button */}
      <Box sx={{ mb: 2, position: 'absolute', top: 20, left: 30 }}>
        <Tooltip title="Options" arrow>
          <IconButton
            color="primary"
            onClick={handleMenuOpen}
            sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>

        {/* Options Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { setOpenCreateCollection(true); handleMenuClose(); }}>
            <AddIcon sx={{ mr: 1 }} />
            Create New Collection
          </MenuItem>
          <MenuItem onClick={() => { handleSortChange('asc'); }}>
            <SortAscendingIcon sx={{ mr: 1 }} />
            Sort Ascending
          </MenuItem>
          <MenuItem onClick={() => { handleSortChange('desc'); }}>
            <SortDescendingIcon sx={{ mr: 1 }} />
            Sort Descending
          </MenuItem>
        </Menu>
      </Box>

      {/* Create Collection Modal */}
      <CreateCollection
        open={openCreateCollection}
        onClose={() => setOpenCreateCollection(false)}
        fetchData={() => userId && dispatch(fetchUserCollections(userId))}
      />

      {/* Content Display */}
      {selectedTagId === 0 ? (
        // Display Collections
        loading ? (
          <LoadingIndicator />
        ) : (
          <Grid container spacing={2}>
            {collections.map((tag) => (
              <Grid item key={tag.id}>
                <Chip
                  label={tag.name}
                  icon={<CollectionsIcon color="primary" />}
                  color="secondary"
                  onClick={() => handleTagSelect(tag.id)}
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#3f51b5',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    fontSize: '20px',
                    padding: '50px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: 'auto',
                    cursor: 'pointer',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    margin: '20px 20px',
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = 'scale(1.05)';
                    target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = 'scale(1)';
                    target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        // Display Files in Selected Collection
        loading ? (
          <LoadingIndicator />
        ) : (
          <ImageList>
            {files.map((file) => (
              <ImageListItem key={file.id} component="div">
                <FileItem 
                  file={file} 
                  onDelete={handleRefreshFiles} 
                  onOpenPreview={handleOpenPreview} 
                />
              </ImageListItem>
            ))}
          </ImageList>
        )
      )}

      {/* Image Preview Modal */}
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
  );
};

export default Collections;