import React, { useState } from 'react';
import { Drawer, List,  ListItemIcon, ListItemText, IconButton, Box, ListItemButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CollectionsIcon from '@mui/icons-material/Collections';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import StarIcon from '@mui/icons-material/Star';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MenuIcon from '@mui/icons-material/Menu';
import AccountMenu from './account/accountMenu';
import AI from '../page/AI/AI';

const NAVIGATION = [
    { path: '/myWorkspace/gallery', title: 'Gallery', icon: <DashboardIcon /> },
    { path: '/myWorkspace/upload', title: 'Upload', icon: <UploadFileIcon /> },
    { path: '/myWorkspace/collections', title: 'My Collections', icon: <CollectionsIcon /> },
    { path: '/myWorkspace/design', title: 'Design', icon: <StarIcon /> },
    { path: '/myWorkspace/more', title: 'More', icon: <MoreHorizIcon /> },
];

const Sidebar = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', width: 1140, right: -20, marginTop: '7%'}}></div> */}
        <Drawer 
            variant="permanent" 
            anchor="left" 
            sx={{
                height: 'calc(90% - 96px)', 
                backgroundColor: 'rgba(255, 255, 255, 0.75)', // שקיפות
                zIndex: 0,
                button: 0,
                paddingLeft: 4, // תזוזה ימינה
                width: open ? 240 : 80, // אם הסיידבר פתוח או סגור
                position: 'relative'
               
            }}
        >
            <AccountMenu/>
            <Box sx={{ mt: 8, display: 'flex', alignItems: 'center', pl: 2, pr: 2, pt: 1, pb: 1 }}>
                <IconButton 
                    onClick={() => setOpen(!open)} 
                    sx={{ 
                        borderRadius: '50%', 
                        padding: 1, 
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
                        alignSelf: 'center'
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </Box>
            <List sx={{zIndex: 2}}>
                {NAVIGATION.map((item) => (
                    <ListItemButton 
                        key={item.path} 
                        component={Link} 
                        to={item.path} 
                        selected={location.pathname === item.path}
                        sx={{ '&.Mui-selected': { backgroundColor: 'rgba(0, 0, 0, 0.1)' } }}
                    >
                        <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'secondary.main' }}>
                            {item.icon}
                        </ListItemIcon>
                        {open && <ListItemText primaryTypographyProps={{ color: location.pathname === item.path ? 'primary.main' : 'secondary.main' }} primary={item.title} />}
                    </ListItemButton>
                ))}
            </List>
            <AI/>

        </Drawer>
        </>

    );
};

export default Sidebar;
