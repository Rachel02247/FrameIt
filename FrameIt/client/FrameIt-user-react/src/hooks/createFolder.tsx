import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { createFolder } from "../services/filesService";
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { RootState } from '../component/global-states/store';

const CreateFolder = ({ folderId = '0', fetchData }: { folderId: string; fetchData: (_folderId: string) => void }) => {
  const [folderName, setFolderName] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user.user); // או לפי האיד של המשתמש הנוכחי אם יש לך

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
      const newFolder = {
        name: folderName,
        ownerId: typeof user?.id === 'string' ? parseInt(user.id, 10) : user?.id ?? 0,
        isDeleted: false,
      };

      const response = await createFolder(newFolder); 
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

