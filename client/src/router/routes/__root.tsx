import { createRootRoute } from "@tanstack/react-router";
import { MFLManager } from "MFLManager";

const component = () => (
  <MFLManager />
);

const errorComponent = () => (
  <h1>Invalid Route</h1>
);

export const Route = createRootRoute({
  component: component,
  errorComponent: errorComponent,
});
