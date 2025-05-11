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
import { RootState } from '../component/global-states/store';
import { useLanguage } from "../context/LanguageContext";

interface CreateCollectionProps {
  open: boolean;
  onClose: () => void;
  fetchData: () => void;
}

const CreateCollection: React.FC<CreateCollectionProps> = ({ open, onClose, fetchData }) => {
  const [collectionName, setCollectionName] = useState('');
  const userId = useSelector((state: RootState) => state.user.user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();
  const translations = {
    en: {
      title: "Create New Collection",
      namePlaceholder: "Collection Name",
      cancel: "Cancel",
      create: "Create",
    },
    he: {
      title: "צור אוסף חדש",
      namePlaceholder: "שם האוסף",
      cancel: "ביטול",
      create: "צור",
    },
  };

  const t = translations[language];

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
    } catch (error: unknown) { // Added explicit type for error
      console.error('Error creating collection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t.title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <TextField
              autoFocus
              label={t.namePlaceholder}
              fullWidth
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t.cancel}
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            variant="contained" 
            disabled={!collectionName.trim() || isSubmitting}
          >
            {t.create}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCollection;