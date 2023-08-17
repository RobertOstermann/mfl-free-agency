import { Route } from "@tanstack/react-router";

import PlayerPage from "components/pages/players/PlayerPage";
import { rootRoute } from "components/router/RootRoute";

const component = () => (
  <PlayerPage />
);

export const playersRoute = new Route({
  path: "/players",
  getParentRoute: () => rootRoute,
  component,
});
