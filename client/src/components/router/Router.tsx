import { Router as TanstackRouter } from "@tanstack/react-router";

import { capTrackerRoute } from "components/router/pages/cap-tracker";
import { freeAgencyRoute } from "components/router/pages/free-agency";
import { homeRoute } from "components/router/pages/home";
import { playersRoute } from "components/router/pages/players";
import { rootRoute } from "components/router/RootRoute";

const routeTree = rootRoute.addChildren([
  homeRoute,
  capTrackerRoute,
  freeAgencyRoute,
  playersRoute,
]);

export const router = new TanstackRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
