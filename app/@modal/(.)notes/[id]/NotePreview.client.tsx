"use client";

import { Modal } from "@/components/Modal/Modal";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { Note } from "@/types/note";
import css from "./NotePreview.module.css";

interface Props {
  noteId: string;
}

export default function NotePreview({ noteId }: Props) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  const handleClose = () => router.back();

  if (isLoading)
    return <Modal onClose={handleClose}>Loading, please wait...</Modal>;
  if (error || !note)
    return <Modal onClose={handleClose}>Something went wrong.</Modal>;

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.tag}>{note.tag}</div>
        <h2 className={css.title}>{note.title}</h2>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
      </div>
    </Modal>
  );
}
