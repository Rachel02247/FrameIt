/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import './style.css';

export default () => {
  return (
    <Box className="footer" 
     sx={{ bgcolor: 'lightgray', color: '#000', width: '1280px', height: 60 , mt: 8}} 
     id="contact">
    <Container>
      <Typography variant="body1" align="center">
        &copy; 2025 FrameIt. All rights reserved.
      </Typography>
      <Typography variant="body2" align="center">
        Contact us at: <Link href="mailto:support@frameit.com" color="inherit">support@frameit.com</Link>
      </Typography>
    </Container>
  </Box>
  );
};

