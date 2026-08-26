import * as React from "react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <>
      <div className="flex items-center border-b">
        <h2 className="p-2 text-xl">Dashboard</h2>
        <Link
          to="/dashboard/posts/$postId"
          params={{
            postId: "3",
          }}
          className="rounded-full bg-blue-500 px-2 py-1 text-xs text-white"
        >
          1 New Invoice
        </Link>
      </div>
      <div className="flex flex-wrap divide-x">
        {(
          [
            [".", "Summary"],
            ["/dashboard/posts", "Posts"],
          ] as const
        ).map(([to, label]) => {
          return (
            <Link
              from={Route.fullPath}
              key={to}
              to={to}
              activeOptions={{ exact: to === "." }}
              activeProps={{ className: `font-bold` }}
              className="p-2"
            >
              {label}
            </Link>
          );
        })}
      </div>
      <hr />
      <Outlet />
    </>
  );
}
