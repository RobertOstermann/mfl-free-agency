import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { createRouter } from "@/client/router/router";

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import "./styles/tailwind.css";

// Set up a Router instance
const router = createRouter();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
