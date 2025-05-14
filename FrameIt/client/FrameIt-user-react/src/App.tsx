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

function AppContent() {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
    // (אופציונלי) גם ה-html
    document.documentElement.style.backgroundColor = theme.palette.background.default;
  }, [theme.palette.background.default]);

  return (
    <>
      <LanguageToggle />
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
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
