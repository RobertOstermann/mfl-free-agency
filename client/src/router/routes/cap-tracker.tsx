import { createFileRoute } from "@tanstack/react-router";

import { CapTrackerPage } from "components/pages/cap-tracker/CapTrackerPage";

const component = () => (
  <CapTrackerPage />
);

export const Route = createFileRoute("/cap-tracker")({
  component: component,
});
