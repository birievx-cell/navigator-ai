import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./LogoutButton";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="no-print border-b border-line bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href={user ? "/dashboard" : "/"} className="font-display text-sm font-bold tracking-wide">
          НАВИГАТОР<span className="text-cobalt">·AI</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className="rounded-lg px-3 py-2 hover:bg-cobalt-soft">
                Мои проекты
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="rounded-lg px-3 py-2 font-semibold text-cobalt hover:bg-cobalt-soft">
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
