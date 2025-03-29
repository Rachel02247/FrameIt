import React, { useState } from 'react';
import { Box, Typography, Switch, FormControlLabel, TextField, Button } from '@mui/material';

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');

  const handleEmailNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailNotifications(event.target.checked);
  };

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
    // אפשר להוסיף כאן לוגיקה לשמירת השינויים ב-Redux או API
    console.log('Settings saved', { emailNotifications, darkMode, userName, email });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">Settings</Typography>

      <Box sx={{ marginTop: 3 }}>
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
      </Box>

      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6">Notification Settings</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={emailNotifications}
              onChange={handleEmailNotificationsChange}
              name="emailNotifications"
            />
          }
          label="Email Notifications"
        />
      </Box>

      <Box sx={{ marginTop: 3 }}>
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
      </Box>

      <Box sx={{ marginTop: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
