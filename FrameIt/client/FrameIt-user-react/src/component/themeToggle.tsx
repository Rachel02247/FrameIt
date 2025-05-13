import React, { useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Switch,
  Box,
  styled,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LightModeIcon from "@mui/icons-material/LightMode";
import getTheme from "../theme";
import { useLanguage } from "../context/LanguageContext";

interface ThemeToggleProps {
  children: React.ReactNode;
}

const TinyIconSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 28,
  padding: 0,
  display: "flex",
  alignItems: "center",
  '& .MuiSwitch-switchBase': {
    padding: 2,
    margin: 2,
    '&.Mui-checked': {
      transform: 'translateX(22px)',
      '& + .MuiSwitch-track': {
        backgroundColor: '#bbb',
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 22,
    height: 22,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      fontSize: 16,
      color: '#555',
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 20,
    backgroundColor: '#ddd',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 300,
    }),
  },
}));

const ThemeToggle: React.FC<ThemeToggleProps> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const { language } = useLanguage();

  const isSidebarVisible =
    window.location.pathname.startsWith("/myWorkspace") ||
    window.location.pathname === "/login" ||
    window.location.pathname === "/register";

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />

        {!isSidebarVisible && (
          <Box
            sx={{
              position: "absolute",
              top: 30,
              [language === "he" ? "right" : "left"]: 122,
              zIndex: 0,
            }}
          >
            <TinyIconSwitch
              checked={mode === "dark"}
              onChange={toggleTheme}
              icon={<WbSunnyIcon />}
              checkedIcon={<LightModeIcon />}
            />
          </Box>

        )}{children}
      </ThemeProvider>
    </>
  );
};

export default ThemeToggle;
