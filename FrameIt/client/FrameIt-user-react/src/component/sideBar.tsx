import React, { useState } from 'react';
import { Drawer, List,  ListItemIcon, ListItemText, IconButton, Box, ListItemButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CollectionsIcon from '@mui/icons-material/Collections';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MenuIcon from '@mui/icons-material/Menu';
import AccountMenu from './account/accountMenu';
import AI from '../page/AI/AI';
import { useLanguage } from "../context/LanguageContext";

const Sidebar = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const { language } = useLanguage();

    const translations = {
        en: {
            gallery: "Gallery",
            upload: "Upload",
            collections: "My Collections",
            design: "Design",
            more: "More",
        },
        he: {
            gallery: "גלריה",
            upload: "העלאה",
            collections: "האוספים שלי",
            design: "עיצוב",
            more: "עוד",
        },
    };

    const t = translations[language];

    const NAVIGATION = [
        { path: "/myWorkspace/gallery", title: t.gallery, icon: <DashboardIcon /> },
        { path: "/myWorkspace/upload", title: t.upload, icon: <UploadFileIcon /> },
        { path: "/myWorkspace/collections", title: t.collections, icon: <CollectionsIcon /> },
        { path: "/myWorkspace/design", title: t.design, icon: <AutoAwesomeMosaicIcon /> },
        { path: "/myWorkspace/more", title: t.more, icon: <MoreHorizIcon /> },
    ];

    return (
        <Drawer
            variant="permanent"
            anchor={language === "he" ? "right" : "left"}
            sx={{
                height: "calc(90% - 96px)",
                zIndex: 1,
                button: 0,
                paddingLeft: 4,
                width: open ? 240 : 80,
                position: "relative",
            }}
        >
            <AccountMenu />
            <Box
                sx={{
                    mt: 8,
                    display: "flex",
                    alignItems: "center",
                    pl: 2,
                    pr: 2,
                    pt: 1,
                    pb: 1,
                    flexDirection: language === "he" ? "row-reverse" : "row",
                }}
            >
                <IconButton
                    onClick={() => setOpen(!open)}
                    sx={{
                        borderRadius: "50%",
                        padding: 1,
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.2)" },
                        alignSelf: "center",
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </Box>
            <List sx={{ zIndex: 2 }}>
                {NAVIGATION.map((item) => (
                    <ListItemButton
                        key={item.path}
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path}
                        sx={{
                            "&.Mui-selected": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                            flexDirection: language === "he" ? "row-reverse" : "row",
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: location.pathname === item.path ? "primary.main" : "secondary.main",
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        {open && (
                            <ListItemText
                                primaryTypographyProps={{
                                    color: location.pathname === item.path ? "primary.main" : "secondary.main",
                                }}
                                primary={item.title}
                            />
                        )}
                    </ListItemButton>
                ))}
            </List>
            <AI />
        </Drawer>
    );
};

export default Sidebar;
