
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button, 
  DialogActions,
  Box
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../global-states/store';

interface CreateCollectionProps {
  open: boolean;
  onClose: () => void;
  fetchData: () => void;
}

const CreateCollection: React.FC<CreateCollectionProps> = ({ open, onClose, fetchData }) => {
  const [collectionName, setCollectionName] = useState('');
  const userId = useSelector((state: RootState) => state.user.user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionName.trim() || !userId) return;

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5282/tags', {
        name: collectionName,
        userId
      });
      setCollectionName('');
      fetchData();
      onClose();
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Collection</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <TextField
              autoFocus
              label="Collection Name"
              fullWidth
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            variant="contained" 
            disabled={!collectionName.trim() || isSubmitting}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCollection;