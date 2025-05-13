// LoadingIndicator.tsx
import { Box } from '@mui/material';
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <img src="img/spinner.gif" alt="spinner" width={50}/>
    </Box>
  );
};

export default LoadingIndicator;
