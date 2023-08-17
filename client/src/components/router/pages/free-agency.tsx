import { Route } from "@tanstack/react-router";

import FreeAgencyPage from "components/pages/free-agency/FreeAgencyPage";
import { rootRoute } from "components/router/RootRoute";

const component = () => (
  <FreeAgencyPage />
);

export const freeAgencyRoute = new Route({
  path: "/free-agency",
  getParentRoute: () => rootRoute,
  component,
});
