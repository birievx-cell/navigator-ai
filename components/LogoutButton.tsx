"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="rounded-lg px-3 py-2 text-muted hover:bg-cobalt-soft hover:text-ink"
    >
      Выйти
    </button>
  );
}
