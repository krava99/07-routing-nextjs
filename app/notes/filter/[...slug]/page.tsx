import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes, FetchNotesParams } from "@/lib/api";
import NotesClient from "./Notes.client";

type Params = Promise<{ slug: string[] }>;

export default async function FilteredNotesPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const filterSlug = slug?.[0] || "all";
  const tagToFetch = filterSlug === "all" ? undefined : filterSlug;

  const fetchParams: FetchNotesParams = {
    page: 1,
    perPage: 12,
    search: "",
    tag: tagToFetch,
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { ...fetchParams }],
    queryFn: () => fetchNotes(fetchParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={filterSlug} initialParams={fetchParams} />
    </HydrationBoundary>
  );
}
