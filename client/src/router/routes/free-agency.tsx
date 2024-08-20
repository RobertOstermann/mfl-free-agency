import { createFileRoute } from "@tanstack/react-router";

import { FreeAgencyPage } from "components/pages/free-agency/FreeAgencyPage";

const component = () => (
  <FreeAgencyPage />
);

export const Route = createFileRoute("/free-agency")({
  component: component,
});
