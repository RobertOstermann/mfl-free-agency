import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { router } from "components/router/Router";

import "index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

// This clears the console on hot reloads during development
// if (import.meta.hot) {
//   import.meta.hot.on(
//     "vite:beforeUpdate",
//     () => console.clear(),
//   );
// }

root.render(
  <CookiesProvider>
    <RouterProvider router={router} />
  </CookiesProvider>,
);
