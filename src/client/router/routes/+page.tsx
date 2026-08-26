import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Spinner } from "@/client/components/Spinner";
import { trpc } from "@/client/router/router";

export const Route = createFileRoute("/")({
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.query(trpc.counter.get.queryOptions());
    return;
  },
  component: IndexComponent,
});

function IndexComponent() {
  const queryClient = useQueryClient();
  const counterQuery = useQuery(trpc.counter.get.queryOptions());
  const incrementMutation = useMutation(
    trpc.counter.increment.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.counter.get.queryKey(),
        });
      },
    }),
  );

  return (
    <div className={`p-2`}>
      <div className={`text-lg`}>Welcome Home!</div>
      <hr className={`my-2`} />
      <div className={`flex items-center gap-3`}>
        <span className={`text-sm text-gray-600`}>Database counter:</span>
        <span className={`text-2xl font-bold tabular-nums`}>
          {counterQuery.isPending ? <Spinner /> : counterQuery.data}
        </span>
        <button
          type="button"
          onClick={() => incrementMutation.mutate(undefined)}
          disabled={incrementMutation.isPending}
          className={`rounded-full bg-blue-500 px-3 py-1 text-sm text-white disabled:opacity-50`}
        >
          {incrementMutation.isPending ? "Incrementing..." : "Increment"}
        </button>
      </div>
      {counterQuery.isError ? (
        <div className={`mt-2 text-sm text-red-600`}>
          Could not read the counter: {counterQuery.error.message}
        </div>
      ) : null}
      {incrementMutation.isError ? (
        <div className={`mt-2 text-sm text-red-600`}>
          Could not increment the counter: {incrementMutation.error.message}
        </div>
      ) : null}
      <hr className={`my-2`} />
      <Link
        to="/dashboard/posts/$postId"
        params={{
          postId: "3",
        }}
        className={`rounded-full bg-blue-500 px-2 py-1 text-xs text-white`}
      >
        1 New Invoice
      </Link>
      <hr className={`my-2`} />
      <div className={`max-w-xl`}>
        As you navigate around take note of the UX. It should feel
        suspense-like, where routes are only rendered once all of their data and
        elements are ready.
        <hr className={`my-2`} />
        To exaggerate async effects, play with the artificial request delay
        slider in the bottom-left corner.
        <hr className={`my-2`} />
        The last 2 sliders determine if link-hover preloading is enabled (and
        how long those preloads stick around) and also whether to cache rendered
        route data (and for how long). Both of these default to 0 (or off).
      </div>
    </div>
  );
}
