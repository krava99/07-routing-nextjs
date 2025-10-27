import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import Notes from "./Notes.client";
import type { NoteTag } from "@/types/note";

type Props = {
  params: { tag?: string[] };
};

const FilteredNotesPage = async ({ params }: Props) => {
  const searchTag = params.tag?.[0] ?? "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", searchTag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 10,
        tag: searchTag !== "all" ? (searchTag as NoteTag) : undefined,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={searchTag !== "all" ? (searchTag as NoteTag) : undefined} />
    </HydrationBoundary>
  );
};

export default FilteredNotesPage;
