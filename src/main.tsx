import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import '@mantine/dates/styles.css'; // need this to proper formatting of date components

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
