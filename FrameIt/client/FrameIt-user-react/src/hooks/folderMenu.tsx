/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [, setSortOption] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddFolder = () => {
    console.log('Add Folder clicked');
    handleMenuClose();
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    console.log(`Sort by: ${option}`);
    handleMenuClose();
  };

  return (
    <div style={{top: 20, left: 60, position: 'absolute'}}>
      <IconButton onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleAddFolder}>Add Folder</MenuItem>
        <MenuItem onClick={() => handleSortChange('Name')}>Sort by Name</MenuItem>
        <MenuItem onClick={() => handleSortChange('Date Modified')}>Sort by Date Modified</MenuItem>
      </Menu>
    </div>
  );
};

