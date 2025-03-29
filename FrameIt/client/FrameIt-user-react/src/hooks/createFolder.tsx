import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { RootState } from '../component/global-states/store';

const CreateFolder= (folderId: string = '0') => {
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
      console.log(folderId);
      const newFolder = { 
        name: folderName,
        parentFolderId: folderId.folderId,
        ownerId: user?.id?? 0 ,
        isDeleted: false
       };
       console.log(newFolder)
       const response = await axios.post(
        'http://localhost:5282/folders',
        newFolder,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
             console.log(response.data);

      handleClose();

      // Notify the server about the new folder
      // await axios.post('http://localhost:5282/folders/update', { folder: response.data });
    } catch (error) {
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

// import React, { useState } from 'react';
// import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
// import axios from 'axios';
// import AddIcon from '@mui/icons-material/Add';

// const CreateFolder: React.FC = () => {
//   const [folderName, setFolderName] = useState<string>('');
//   const [openDialog, setOpenDialog] = useState<boolean>(false);

//   const handleClick = () => {
//     setOpenDialog(true);
//   };

//   const handleClose = () => {
//     setOpenDialog(false);
//     setFolderName('');
//   };

//   const handleCreateFolder = async () => {
//     if (folderName.trim() === '') {
//       alert('Please enter a folder name');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5282/folders', { name: folderName });
//       alert('Folder created successfully!');
//       handleClose();

//       // Notify the server about the new folder
//       await axios.post('http://localhost:5282/folders/update', { folder: response.data });
//     } catch (error) {
//       alert('Error creating folder');
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <Tooltip title="New Folder" arrow
//         sx={{
//           position: 'absolute',
//           right: 20,
//           top: 20
//         }}>
//         <IconButton color="primary" onClick={handleClick}>
//           <AddIcon />
//         </IconButton>
//       </Tooltip>

//       <Dialog open={openDialog} onClose={handleClose}>
//         <DialogTitle>Create New Folder</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="folderName"
//             label="Folder Name"
//             type="text"
//             fullWidth
//             value={folderName}
//             onChange={(e) => setFolderName(e.target.value)}
//             variant="outlined"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleCreateFolder} color="primary">
//             Create
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default CreateFolder;
