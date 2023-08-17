import { Route } from "@tanstack/react-router";

import HomePage from "components/pages/home/HomePage";
import { rootRoute } from "components/router/RootRoute";

const component = () => (
  <HomePage />
);

export const homeRoute = new Route({
  path: "/",
  getParentRoute: () => rootRoute,
  component,
});
