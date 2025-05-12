import React, { useState } from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../global-states/store"; // Adjusted the path to the store file
import { changePassword } from "../global-states/userSlice";

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.user); // Fixed state selection

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      const result = await dispatch(changePassword({ currentPassword, newPassword }));
      if (changePassword.fulfilled.match(result)) {
        setSuccessMessage("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setSuccessMessage("");
      }
    } catch (err) {
      console.error("Error updating password:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleChangePassword}>
        <TextField
          label="Current Password"
          type="password"
          fullWidth
          margin="normal"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>

        {successMessage && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {successMessage}
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default Settings;
