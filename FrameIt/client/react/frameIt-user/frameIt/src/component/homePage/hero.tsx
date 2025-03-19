/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import './style.css';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <Box className="hero" sx={{mt: 8, bgcolor: 'transparent',  height: '100%', display: 'flex', alignItems: 'center' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Title */}
          <Typography variant="h2" component="h1" align="center" color='primary' sx={{ fontWeight: 'bold' }}>
            Welcome to FrameIt
          </Typography>
          <Typography variant="h6" align="center" color='secondary' sx={{ marginBottom: 2 }}>
            Your go-to cloud photo management app. Organize, share, and enhance your memories with ease.
          </Typography>

          {/* Add the logo image */}
          <Box sx={{ display: 'flex', justifyContent: 'center', m: 4, position: 'relative' }}>
            <img 
              src="img/frameItLogo.png" 
              alt="FrameIt Logo" 
              style={{ width: 400, objectFit: 'fill' }} 
            />
          </Box>

          {/* Button for Call to Action */}
        
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" size="large" component={Link} to="/login">
              Get Started
            </Button>
          </Box>
          <Typography variant="h5" align="center" color='primary' sx={{ m: 2, mt: 6 }}>you have already an account?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" size="large" component={Link} to="/login">
            sign in
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
