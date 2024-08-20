import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "components/pages/home/HomePage";

const component = () => (
  <HomePage />
);

export const Route = createFileRoute("/")({
  component: component,
});
