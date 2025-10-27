import { redirect } from "next/navigation";

export default function NotesRootPage() {
  redirect("/notes/filter/all");
}
