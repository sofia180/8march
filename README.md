# WishDrop – 8 March wishlist MVP

Премиум-лендинг + конструктор вишлистов с глобальным поиском, топом и Telegram mini-app.

## Стек
- Статический фронт (HTML/CSS/JS) на Vercel / GitHub Pages.
- Firebase Firestore (реальные данные) с демо-фолбэком в localStorage.
- Telegram WebApp (`tg.html`) + verify endpoint `/api/tg-verify`.

## Страницы
- `index.html` – лендинг, обратный отсчёт до 8 марта, глобальный поиск, топ.
- `create.html` – создание профиля, добавление подарков, Telegram/Instagram симуляция.
- `card.html` – карточка пользователя, статусы подарков (нужно/зарезервировано/отправлено), шаринг.
- `tg.html` – компактная версия для Telegram WebApp.

## Firebase
1) Конфиг уже прописан в `app.js`.
2) Правила для MVP (открытый доступ, поменять после теста):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true;
      match /gifts/{giftId} {
        allow read, write: if true;
      }
    }
  }
}
```
3) После запуска заменить на более строгие (auth/валидация полей).

Пример более строгих правил (read: true, write с валидацией полей):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.resource.data.name is string
                   && request.resource.data.name.size() <= 80
                   && request.resource.data.about is string
                   && request.resource.data.about.size() <= 280
                   && request.resource.data.searchName is string
                   && request.resource.data.createdAt is timestamp;
      match /gifts/{giftId} {
        allow read: if true;
        allow write: if request.resource.data.link is string
                     && request.resource.data.link.size() <= 500
                     && request.resource.data.status in ['needed','reserved','sent']
                     && request.resource.data.donor is string;
      }
    }
  }
}
```

## Telegram
- Бот: `glamgift_bot`
- Домен в BotFather: `https://8march.extender.cards`
- WebApp URL: `https://8march.extender.cards/tg.html`
- Callback verify: `/api/tg-verify` (проверка initData по `TG_BOT_TOKEN`).
- Кнопка в боте: инлайн `web_app` на URL выше.

## Env (Vercel)
- `TG_BOT_TOKEN` — токен бота.
- `FRONTEND_ORIGIN` — `https://8march.extender.cards`.
- Для загрузки аватаров нужен Firebase Storage (тот же проект).

## Фолбэк/демо
- При недоступном Firestore включается демо-режим: тестовые пользователи в localStorage, поиск и топ не пустые.

## Быстрый старт локально
Открыть `index.html` (файлы статичны). Для реальных данных нужен HTTPS + корректный Firebase config.

## Деплой
```
npx vercel deploy --prod
```
Alias настроен на `8march.extender.cards`.

## TODO (опционально)
- GA4 события (create_profile / add_gift / send_gift).
- Ужесточить правила Firestore (валидация полей, auth).
- Обрезка длинных ссылок в карточке подарков.
- Добавить Storage rules (пример):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{file} {
      allow read: if true;
      allow write: if request.resource.size < 3 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*|application/pdf');
    }
  }
}
```
