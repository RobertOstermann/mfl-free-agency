import { RouterContext } from "@tanstack/react-router";

import MFLManager from "../../MFLManager";

const component = () => (
  <MFLManager />
);

const errorComponent = () => (
  <h1>Invalid Route</h1>
);

const routerContext = new RouterContext<{}>();

export const rootRoute = routerContext.createRootRoute({
  component,
  errorComponent,
});
