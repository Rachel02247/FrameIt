/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PhotoCamera, Share, Cloud } from '@mui/icons-material';
import './style.css';

export default () => {
  return (
    <Box className="hero" sx={{ mt: 6, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ textAlign: 'center' }}
        >
        <Typography variant='h1' component='h1' color='secondary'  sx={{ fontWeight: 'bold', mb: 4 }}>FrameIt</Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <Box>
            <motion.img
              src="img/frameItLogo.png"
              alt="FrameIt Logo"
              style={{ width: 350 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />
          </Box>
          
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <PhotoCamera color="primary" fontSize="large" />
              <Typography variant="h6" color='text.secondary'>
                Organize your photos effortlessly
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Share color="primary" fontSize="large" />
              <Typography variant="h6" color='text.secondary'>
                Share your memories instantly
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Cloud color="primary" fontSize="large" />
              <Typography variant="h6" color='text.secondary'>
                Secure cloud storage for all your moments
              </Typography>
            </Box>
          </Box>
        </motion.div>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', mt: 6 }}>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button variant="contained" color="primary" size="large" component={Link} to="/register">
              Get Started
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button variant="outlined" color="primary" size="large" component={Link} to="/login">
              Sign In
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
