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

  const translations = {
    en: {
      profile: 'Profile Settings',
      appearance: 'Appearance Settings',
      darkMode: 'Dark Mode',
      username: 'Username',
      email: 'Email',
      save: 'Save Changes',
      switchToHebrew: 'Switch to Hebrew',
      switchToEnglish: 'Switch to English',
    },
    he: {
      profile: 'הגדרות פרופיל',
      appearance: 'הגדרות מראה',
      darkMode: 'מצב כהה',
      username: 'שם משתמש',
      email: 'אימייל',
      save: 'שמור שינויים',
      switchToHebrew: 'עבור לעברית',
      switchToEnglish: 'עבור לאנגלית',
    },
  };

  const t = translations[language];

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
      <Box sx={{ padding: 2, direction: language === 'he' ? 'rtl' : 'ltr' }}>
        <Typography variant="h4">{language === 'he' ? 'הגדרות' : 'Settings'}</Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Settings Tabs"
          sx={{ mb: 3 }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={t.profile} />
          <Tab label={t.appearance} />
        </Tabs>

        <Box>
          {tabValue === 0 && (
            <div>
              <Typography variant="h6">{t.profile}</Typography>
              <TextField
                label={t.username}
                variant="outlined"
                value={userName}
                onChange={handleUserNameChange}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label={t.email}
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
              <Typography variant="h6">{t.appearance}</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleDarkModeChange}
                    name="darkMode"
                  />
                }
                label={t.darkMode}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={language === 'he'}
                    onChange={toggleLanguage}
                    name="language"
                  />
                }
                label={language === 'en' ? t.switchToHebrew : t.switchToEnglish}
              />
            </div>
          )}

          <Box sx={{ marginTop: 3 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              {t.save}
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Settings;
