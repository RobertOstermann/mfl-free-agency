import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  MatchRoute,
  Outlet,
} from "@tanstack/react-router";

import { trpc } from "@/router";

import { Spinner } from "@/client/components/spinner";

export const Route = createFileRoute("/dashboard/posts")({
  errorComponent: () => "Oh crap!",
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.ensureQueryData(trpc.posts.queryOptions());
    return;
  },
  pendingComponent: Spinner,
  component: DashboardPostsComponent,
});

function DashboardPostsComponent() {
  const postsQuery = useQuery(trpc.posts.queryOptions());

  const posts = postsQuery.data || [];

  return (
    <div className="flex flex-1">
      <div className="w-48 divide-y">
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <Link
                to="/dashboard/posts/$postId"
                params={{
                  postId: post.id,
                }}
                preload="intent"
                className="block px-3 py-2 text-blue-700"
                activeProps={{ className: `font-bold` }}
              >
                <pre className="text-sm">
                  #{post.id} - {post.title}{" "}
                  <MatchRoute
                    to="/dashboard/posts/$postId"
                    params={{
                      postId: post.id,
                    }}
                    pending
                  >
                    <Spinner />
                  </MatchRoute>
                </pre>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="flex-1 border-l border-gray-200">
        <Outlet />
      </div>
    </div>
  );
}
