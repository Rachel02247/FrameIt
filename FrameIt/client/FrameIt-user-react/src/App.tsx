import React from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./router";
import { Provider } from "react-redux";
import store from "./component/global-states/store";
import ThemeToggle from "./component/themeToggle";

function App() {
  return (
    <ThemeToggle>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeToggle>
  );
}

export default App;
