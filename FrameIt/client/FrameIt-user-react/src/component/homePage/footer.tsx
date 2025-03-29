/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import './style.css';

export default () => {
  return (
    <Box className="footer" 
     sx={{ bgcolor: 'rgb(0, 0, 0, 0)', color: '#000', width: '100%', left: 0,  mt: 8, height: 60 , position: 'absolute', pt: 2}} 
     id="contact">
    <Container>
      <Typography variant="body1" align="center" color='primary' >
        &copy; 2025 FrameIt. All rights reserved.
      </Typography>
      <Typography variant="body2" align="center" color='secondary'>
        Contact us at: <Link href="mailto:support@frameit.com" color="inherit">support@frameit.com</Link>
      </Typography>
    </Container>
  </Box>
  );
};

