/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@mui/material';
import Features from './features';
import Footer from './footer';
import Hero from './hero';
import PhotoGrid from './photoGrid';
import { Link } from 'react-router-dom';
import { Favorite } from '@mui/icons-material';
import ViewGallery from './viewGallery';
import { motion } from 'framer-motion';


const HomePage = () => {
    return (

        <>
            <motion.div whileHover={{}} >
                <Button
                    component={Link}
                    to={sessionStorage.getItem("id") ? "myWorkspace/gallery" : "/login"}
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ position: 'absolute', top: 30, right: 110 }}>
                    <Favorite />
                    my photos
                </Button>
            </motion.div>
            <ViewGallery />
            <Hero />
            <Features />
            <PhotoGrid />
            <Footer />
        </>
    );
};

export default HomePage;
