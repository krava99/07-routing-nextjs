"use client";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  fetchNotes,
  type FetchNotesResponse,
  type FetchNotesParams,
} from "@/lib/api";
import { NoteList } from "../../../../components/NoteList/NoteList";
import { Pagination } from "../../../../components/Pagination/Pagination";
import { Modal } from "../../../../components/Modal/Modal";
import { NoteForm } from "../../../../components/NoteForm/NoteForm";
import { SearchBox } from "../../../../components/SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import css from "./Notes.page.module.css";
import { NoteTag } from "@/types/note";

interface NotesProps {
  initialTag: string;
  initialParams: FetchNotesParams;
}

export const NotesClient = ({ initialTag, initialParams }: NotesProps) => {
  const [search, setSearch] = useState(initialParams.search || "");
  const [page, setPage] = useState(initialParams.page || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);

  const currentTag = initialTag === "all" ? undefined : (initialTag as NoteTag);
  const perPage = initialParams.perPage || 12;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading, isError, isFetching } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", { page, search: debouncedSearch, tag: currentTag }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: perPage,
        search: debouncedSearch,
        tag: currentTag,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoading && !data) return <p>Loading notes...</p>;
  if (isError) return <p>Error loading notes</p>;

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button
          className={css.button}
          onClick={openModal}
          disabled={isFetching}
        >
          Create note +
        </button>
      </header>
      {notes.length ? <NoteList notes={notes} /> : <p>No notes found</p>}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default NotesClient;
