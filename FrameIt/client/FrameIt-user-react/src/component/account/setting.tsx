/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';
import getTheme from '../../theme';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../global-states/store";
import { changePassword } from "../global-states/userSlice";

const Settings = () => {
  const { language, toggleLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const translations = {
    en: {
      profile: 'Change Password',
      appearance: 'Appearance Settings',
      darkMode: 'Dark Mode',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      save: 'Save Changes',
      switchToHebrew: 'Switch to Hebrew',
      switchToEnglish: 'Switch to English',
    },
    he: {
      profile: 'שינוי סיסמה',
      appearance: 'הגדרות מראה',
      darkMode: 'מצב כהה',
      currentPassword: 'סיסמה נוכחית',
      newPassword: 'סיסמה חדשה',
      confirmPassword: 'אישור סיסמה חדשה',
      save: 'שמור שינויים',
      switchToHebrew: 'עבור לעברית',
      switchToEnglish: 'עבור לאנגלית',
    },
  };

  const t = translations[language];

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked);
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError(language === 'he' ? 'הסיסמאות אינן תואמות' : 'Passwords do not match');
      return;
    }

    try {
      const resultAction = await dispatch(changePassword({ currentPassword, newPassword }));
      if (changePassword.fulfilled.match(resultAction)) {
        setSuccess(language === 'he' ? 'הסיסמה עודכנה בהצלחה' : 'Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(resultAction.payload as string || 'Error changing password');
      }
    } catch (err: unknown) {
      setError('Server error');
    }
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
                label={t.currentPassword}
                variant="outlined"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label={t.newPassword}
                variant="outlined"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label={t.confirmPassword}
                variant="outlined"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              {error && <Typography color="error">{error}</Typography>}
              {success && <Typography color="primary">{success}</Typography>}
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
