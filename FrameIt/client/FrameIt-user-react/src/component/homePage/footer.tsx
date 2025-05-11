/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './style.css';

export default () => {
  const theme = useTheme();

  return (
    <Box
      className="footer"
      sx={{
        width: '100%',
        left: 0,
        height: 60,
        position: 'absolute',
        p: 6,
        mb: 10,
        backgroundColor: theme.palette.background.default, 
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

