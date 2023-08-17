import { Route } from "@tanstack/react-router";

import CapTrackerPage from "components/pages/cap-tracker/CapTrackerPage";
import { rootRoute } from "components/router/RootRoute";

const component = () => (
  <CapTrackerPage />
);

export const capTrackerRoute = new Route({
  path: "/cap-tracker",
  getParentRoute: () => rootRoute,
  component,
});
