import { Button } from '@mui/material';
import Features from './features';
import Footer from './footer';
import Hero from './hero';
import PhotoGrid from './photoGrid';
import { Link } from 'react-router-dom';
import { Favorite } from '@mui/icons-material';


const HomePage = () => {
    return (

        <>
            <Button variant="contained" color="primary" size="large" component={Link} to="/login"
                sx={{ position: 'absolute', top: 30, right: 110 }}>
                <Favorite />
                my photos
            </Button>
            <Hero />
            <Features />
            <PhotoGrid />
            <Footer />
        </>
    );
};

export default HomePage;
