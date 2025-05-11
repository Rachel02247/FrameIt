/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@mui/material';
import Features from './features';
import Hero from './hero';
import PhotoGrid from './photoGrid';
import { Link } from 'react-router-dom';
import { Favorite } from '@mui/icons-material';
import ViewGallery from './viewGallery';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import PopupNotice from '../../hooks/popup/popupNotice';

const HomePage = () => {
    const { language } = useLanguage();
    const translations = {
        en: {
            myPhotos: "My Photos",
        },
        he: {
            myPhotos: "התמונות שלי",
        },
    };

    const t = translations[language];

    return (
        <div
            style={{
                direction: language === "he" ? "rtl" : "ltr",
            }}
        >
            <motion.div whileHover={{}}>
                <Button
                    component={Link}
                    to={sessionStorage.getItem("id") ? "myWorkspace/gallery" : "/login"}
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                        position: "absolute",
                        top: 30,
                        [language === "he" ? "left" : "right"]: 120,
                        zIndex: 3,
                    }}
                >
                    <Favorite />
                    {t.myPhotos}
                </Button>
            </motion.div>

            <PopupNotice />

            <ViewGallery />
            <Hero />
            <Features />
            <PhotoGrid />
        </div>
    );
};

export default HomePage;
