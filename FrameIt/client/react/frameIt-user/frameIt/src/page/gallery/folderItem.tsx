// FolderItem.tsx
import React, {  } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';

interface FolderItemProps {
  folder: { id: string; name: string };
  onClick: () => void;
  onDelete: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onClick, onDelete }) => {

  // const [query, setQuery] = useState('');
  // useEffect(()=>{
  //   setQuery(highlightMatch(folder.name))
  // }, [query]);

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: 2,
        width: 170, // רוחב מלא
        // aspectRatio: '1', // יחס גובה-רוחב אחיד (ריבוע)
        height: 170, // גובה גמיש לפי התוכן, אבל יש שימור של היחס
        
        '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' },
      }}
    >
      <FolderIcon sx={{ fontSize: 60, color: '#f1c40f',}} />
      <Typography variant="subtitle1" align="center">
        {folder.name}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: 1}}>
        <IconButton sx={{ color: '#1976d2' }} >
          <DownloadIcon />
        </IconButton>
        <IconButton sx={{ color: '#1976d2' }}>
          <ShareIcon />
        </IconButton>
        <IconButton onClick={onDelete} sx={{ color: '#d32f2f' }}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FolderItem;
