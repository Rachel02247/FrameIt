import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./router";
import { Provider } from "react-redux";
import store from "./component/global-states/store";
import ThemeToggle from "./component/themeToggle";
import { LanguageProvider } from "./context/LanguageContext";
import LanguageToggle from "./component/languageToggle";
import { useTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from '@react-oauth/google';

function AppContent() {
  const theme = useTheme();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    console.log(googleClientId)
    document.body.style.backgroundColor = theme.palette.background.default;
    document.documentElement.style.backgroundColor = theme.palette.background.default;
  }, [theme.palette.background.default]);

  return (
    <>
    <GoogleOAuthProvider clientId={googleClientId}>
      <LanguageToggle />
      <Provider store={store}>
        <RouterProvider router={router} />
        <ToastContainer position="top-center" />
      </Provider>
      </GoogleOAuthProvider>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeToggle>
        <AppContent />
      </ThemeToggle>
    </LanguageProvider>
  );
}

export default App;
