import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
