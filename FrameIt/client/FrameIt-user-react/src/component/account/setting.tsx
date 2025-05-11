import React, { useState } from 'react';
import { Box, Typography, Switch, FormControlLabel, TextField, Button, Tabs, Tab } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';
import getTheme from '../../theme';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { language, toggleLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked);
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSave = () => {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    if (themeToggleButton) {
      themeToggleButton.click();
    }
    toggleLanguage();
    navigate(-1);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={getTheme(darkMode ? 'dark' : 'light')}>
      <CssBaseline />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4">Settings</Typography>

        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Settings Tabs">
          <Tab label="Profile" />
          <Tab label="Settings" />
        </Tabs>

        <Box sx={{ marginTop: 3 }}>
          {tabValue === 0 && (
            <div>
              <Typography variant="h6">Profile Settings</Typography>
              <TextField
                label="Username"
                variant="outlined"
                value={userName}
                onChange={handleUserNameChange}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            </div>
          )}

          {tabValue === 1 && (
            <div>
              <Typography variant="h6">Appearance Settings</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleDarkModeChange}
                    name="darkMode"
                  />
                }
                label="Dark Mode"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={language === 'he'}
                    onChange={toggleLanguage}
                    name="language"
                  />
                }
                label={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
              />
            </div>
          )}

          <Box sx={{ marginTop: 3 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Settings;
