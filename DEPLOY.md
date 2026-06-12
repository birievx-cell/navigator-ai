# Деплой «Навигатор AI» на Vercel — пошагово

## Шаг 1. Supabase (5 минут)
1. https://supabase.com → New project (регион EU, например Frankfurt).
2. SQL Editor → New query → вставьте содержимое `supabase/migrations/001_init.sql` → Run.
3. Project Settings → API: скопируйте **Project URL** и **anon public key**.
4. Authentication → Providers → Email: включён по умолчанию (magic link).

## Шаг 2. Anthropic
1. https://console.anthropic.com → API Keys → Create Key.
2. Пополните баланс (для MVP хватит 5–10 $: документ ≈ 0,05–0,10 $).

## Шаг 3. Vercel
1. Запушьте репозиторий на GitHub.
2. https://vercel.com → Add New → Project → импортируйте репозиторий (фреймворк определится сам).
3. Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` = https://ВАШ-ДОМЕН.vercel.app
4. Deploy.

## Шаг 4. Связать auth-редиректы
Supabase → Authentication → URL Configuration:
- **Site URL**: `https://ВАШ-ДОМЕН.vercel.app`
- **Redirect URLs**: добавьте `https://ВАШ-ДОМЕН.vercel.app/auth/callback`
  (и `http://localhost:3000/auth/callback` для локальной разработки).

## Шаг 5. Проверка перед запуском (чек-лист)
- [ ] Вход по magic-link приходит и логинит
- [ ] Ввод идеи на лендинге без логина → после входа проект создаётся сам
- [ ] 5 вопросов → генерация 40–90 с → документ открывается
- [ ] Закрыть вкладку на вопросе 3 → вернуться → ответы на месте
- [ ] «Экспорт в PDF» → печать → PDF с кириллицей корректен
- [ ] Чужой projectId в URL → редирект (RLS)

## Эксплуатация
- Таймаут serverless-функции: на Hobby-плане Vercel 60 c может не хватить для генерации
  документа — в `vercel.json` уже задано 120 с (работает на Pro; на Hobby при таймаутах
  уменьшите maxTokens до 4000 в `app/api/generate/route.ts`).
- Расход и ошибки AI: таблица `generations` (токены, латентность, ошибки).
- Качество: таблица `feedback`; правки качества — только в `lib/prompts.ts`.
