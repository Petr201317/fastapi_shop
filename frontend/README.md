# Amazone Frontend

Красивый SPA-фронтенд, который работает с твоим FastAPI бэком через cookies-auth.

## Как запустить

1) Запусти бэкенд (по умолчанию `http://127.0.0.1:8000`).

2) В другом терминале:

```powershell
cd C:\Users\petrd\amazone_clone\frontend
npm install
npm run dev
```

Открой `http://127.0.0.1:5173`.

## Как устроено подключение к бэку

- Vite proxy проксирует `/auth`, `/products`, `/cart` на бэкенд.
- Все запросы идут с `credentials: "include"`, чтобы работали cookies.
- При `401` запрос автоматически пробует `GET /auth/refresh_access_token` и делает retry один раз.

Если у тебя бэкенд на другом адресе/порту:

```powershell
$env:VITE_BACKEND_URL="http://127.0.0.1:8000"; npm run dev
```

