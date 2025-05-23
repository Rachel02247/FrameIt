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
        height: 60,
        position: 'relative',
        mt: 'auto',
        p: 8,
      }}
      id="contact"
    >
      <Container>
        <Typography variant="body1" align="center" color="primary">
          &copy; 2025 FrameIt. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center" color="secondary">
          Contact us at:{' '}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=frameit.noreply@gmail.com&su=Contact%20regarding%20FramelT%20website&body=Hello,%20I%20would%20like%20to%20contact%20regarding%20the%20FramelT%20"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0077cc', textDecoration: 'none', marginLeft: '5px' }}
          >
            support@frameit.com
          </a>

        </Typography>
      </Container>
    </Box>
  );
};

