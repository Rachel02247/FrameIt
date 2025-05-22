/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createFolder } from '../services/folderService';

const CreateFolder = ({ folderId = '0', fetchData }: { folderId: string; fetchData: (_folderId: string) => void; }) => {
 
  const [folderName, setFolderName] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const userId = sessionStorage.getItem('id');

  const handleClick = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setFolderName('');
  };

  const handleCreateFolder = async () => {
    if (folderName.trim() === '') {
      alert('Please enter a folder name');
      return;
    }

    try {
      

      const response = await createFolder({ name: folderName, ownerId: userId? +userId : 0, isDeleted: false, parentFolderId: parseInt(folderId) }); 
      console.log(response);
      handleClose();

      try {
        fetchData(folderId);
      } catch (err) {
        console.log("Failed fetching data: " + err);
      }
    } catch (error: unknown) {
      alert('Error creating folder');
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClick}
        sx={{
          position: 'absolute',
          right: 20,
          top: 20
        }}
      >
        New Folder
      </Button>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="folderName"
            label="Folder Name"
            type="text"
            fullWidth
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateFolder} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateFolder;

