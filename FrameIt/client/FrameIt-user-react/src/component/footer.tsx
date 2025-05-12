/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import './homePage/style.css';

export default () => {
  return (
    <Box
      className="footer"
      sx={{
        zIndex: 0.5,
        width: '100%',
        left: 0,
        height: 60,
        position: 'relative', // Changed to relative
        mt: 'auto', // Pushes the footer to the bottom of the content
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Background color for visibility
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)', // Shadow for separation
      }}
      id="contact"
    >
      <Container>
        <Typography variant="body1" align="center" color="primary">
          &copy; 2025 FrameIt. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center" color="secondary">
          Contact us at:{' '}
          <Link href="mailto:support@frameit.com" color="inherit">
            support@frameit.com
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

