/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Login from '@mui/icons-material/Login';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../global-states/store';
import { useLanguage } from "../../context/LanguageContext";
import { logout } from '../global-states/userSlice';

export default () => {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const UserName = sessionStorage.getItem('name');
  const navigate = useNavigate();
  const { language } = useLanguage();

  const translations = {
    en: {
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      login: "Login",
    },
    he: {
      profile: "פרופיל",
      settings: "הגדרות",
      logout: "התנתק",
      login: "התחבר",
    },
  };

  const t = translations[language];


  const handlelogout = () => {
    dispatch(logout());
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('id');
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          left: 4,
          top: 20,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {UserName?.charAt(0).toUpperCase() ?? null}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/settings')}>
          <Avatar />
          <Link to="/settings">{t.profile}</Link>
        </MenuItem>

        <Divider />
        <MenuItem onClick={() => navigate('/settings?tab=1')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Link to="/settings?tab=1">{t.settings}</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            {user ? <Logout fontSize="small" /> : <Login fontSize="small" />}
          </ListItemIcon>

          <Link to="/login" onClick={handlelogout}>{user ? t.logout : t.login}</Link>

        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
