import React from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./router";
import { Provider } from "react-redux";
import store from "./component/global-states/store";
import ThemeToggle from "./component/themeToggle";
import { LanguageProvider } from "./context/LanguageContext";
import LanguageToggle from "./component/languageToggle";

function App() {
  return (
    <LanguageProvider>
        <ThemeToggle>
          <LanguageToggle />
          <Provider store={store}>
            <RouterProvider router={router} />
          </Provider>
        </ThemeToggle>
    </LanguageProvider>
  );
}

export default App;
