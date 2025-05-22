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
<<<<<<< HEAD
=======
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from '@react-oauth/google';
>>>>>>> clean-dev

function AppContent() {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
<<<<<<< HEAD
    // (אופציונלי) גם ה-html
=======
>>>>>>> clean-dev
    document.documentElement.style.backgroundColor = theme.palette.background.default;
  }, [theme.palette.background.default]);

  return (
    <>
<<<<<<< HEAD
      <LanguageToggle />
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
=======
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <LanguageToggle />
      <Provider store={store}>
        <RouterProvider router={router} />
        <ToastContainer position="top-center" />
      </Provider>
      </GoogleOAuthProvider>
>>>>>>> clean-dev
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
