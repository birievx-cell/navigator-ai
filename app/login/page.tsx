"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendLink() {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Введите корректный email.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setBusy(false);
    if (error) setError("Не удалось отправить письмо. Попробуйте ещё раз.");
    else setSent(true);
  }

  return (
    <main className="blueprint flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <Link href="/" className="font-display text-sm font-bold">
          НАВИГАТОР<span className="text-cobalt">·AI</span>
        </Link>
        <h1 className="mt-6 font-display text-xl font-semibold">Вход по ссылке</h1>
        {sent ? (
          <p className="mt-4 rounded-lg bg-cobalt-soft p-4 text-sm">
            Ссылка для входа отправлена на <b>{email}</b>. Откройте письмо на этом устройстве.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">
              Пароль не нужен — пришлём ссылку на почту. Аккаунт создастся автоматически.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendLink()}
              placeholder="you@example.com"
              className="mt-5 w-full rounded-lg border border-line p-3 outline-none focus:border-cobalt"
              autoFocus
            />
            <Button onClick={sendLink} disabled={busy} className="mt-4 w-full">
              {busy ? "Отправляем…" : "Получить ссылку для входа"}
            </Button>
            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
          </>
        )}
      </Card>
    </main>
  );
}
