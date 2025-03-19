/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Grid, Typography, Paper, Container } from '@mui/material';
import { motion } from 'framer-motion';
import './style.css';

export default () => {
    const features = [
        { title: "Easy Cloud Storage", description: "Store your photos securely in the cloud with effortless upload and access." },
        { title: "Create My Collections", description: "Organize your photos into personalized collections for easy management." },
        { title: "AI Smart Filtering", description: "Use AI-powered filters to find the perfect photo in seconds." },
        { title: "Design Collages", description: "Create beautiful collages from your favorite photos, effortlessly." },
        { title: "Easy Sharing & Download", description: "Share your photos or download them with a single click." }
      ];
    
      return (
        <Paper id="features" sx={{ padding: '50px 20px', backgroundColor: '#fff', mt: 12 }}>
          <Container>
            <Typography variant="h3" align="center" color='primary' sx={{ marginBottom: 5 }}>
              Features
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                  >
                    <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
                      <Typography variant="h5" color='secondary' sx={{  marginBottom: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Paper>
      
  );
};

