# proto-stream [В разработке]

## Описание

Многоуровневое приложение для потоковой обработки и отображения данных. Состоит из backend на Go и frontend на Angular, разворачивается с помощью Docker Compose.

## Стек технологий

### Backend

- **Язык:** Go (версия 1.23.4)
- **Фреймворк:** go-chi (маршрутизация, middleware)
- **ORM:** GORM (работа с PostgreSQL)
- **JWT:** golang-jwt
- **WebSocket:** gorilla/websocket
- **Миграции:** golang-migrate
- **Swagger:** swaggo
- **Валидация:** go-playground/validator
- **Конфигурация:** cleanenv
- **СУБД:** PostgreSQL

### Frontend

- **Фреймворк:** Angular 19
- **SSR:** @angular/ssr
- **Express:** для серверного рендеринга
- **RxJS:** реактивное программирование
- **ngx-cookie-service:** работа с cookie
- **Стили:** стандартные Angular/SCSS
- **Тестирование:** Karma, Jasmine

### Инфраструктура

- **Docker Compose:** для оркестрации сервисов
- **Nginx:** проксирование и SSL (конфиги в папке frontend)
- **SSL:** самоподписанные сертификаты для dev-режима

## Быстрый старт

1. Скопируйте `.env` или `.env.prod` и настройте переменные окружения.
2. Запустите все сервисы:
   ```bash
   docker-compose --env-file .env up --build
   ```
3. Frontend будет доступен на порту 80/443, backend — на 8082/8443.

## Структура проекта

- `backend/` — исходный код backend (Go)
- `frontend/` — исходный код frontend (Angular)
- `compose.yml` — конфигурация Docker Compose

## Разработка

### Backend

- Запуск локально:
  ```bash
  cd backend
  go run ./cmd/...
  ```
- Миграции:
  ```bash
  go run github.com/golang-migrate/migrate/v4
  ```

### Frontend

- Запуск dev-сервера:
  ```bash
  cd frontend
  ng serve
  ```
- Сборка:
  ```bash
  ng build
  ```
