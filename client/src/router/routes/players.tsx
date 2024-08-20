import { createFileRoute } from "@tanstack/react-router";

import { PlayerPage } from "components/pages/players/PlayerPage";

const component = () => (
  <PlayerPage />
);

export const Route = createFileRoute("/players")({
  component: component,
});
