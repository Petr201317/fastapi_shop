# FastAPI Shop API

A backend API for an e-commerce app built with FastAPI, PostgreSQL, SQLAlchemy, and JWT-based auth.

## What This Project Includes

- User registration, login, and current-user endpoints
- Product creation and product listing with `limit` + `offset` pagination
- Alembic migrations for schema management
- `uv`-based dependency and environment workflow
- Docker and Docker Compose setup for local containerized development

## Tech Stack

- Python 3.14
- FastAPI + Uvicorn
- SQLAlchemy 2.x + Alembic
- PostgreSQL
- AuthX + Passlib
- uv

## Project Structure

```text
.
|-- main.py
|-- pyproject.toml
|-- alembic.ini
|-- src/
|   |-- api.py
|   |-- auth/
|   |-- products/
|   |-- db/
|   |-- migrations/
|   |-- jwt/
|   |-- cart/
|   `-- orders/
|-- Dockerfile
`-- docker-compose.yml
```

## Environment Variables

Create your env file from the template:

```bash
cp .env.example .env
# PowerShell: Copy-Item .env.example .env
```

Then update values in `.env` (same level as `pyproject.toml`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=shop_db

JWT_SECRET_KEY=change-me-to-a-long-random-secret
JWT_ALGORITHM=HS256
JWT_REFRESH_EXPIRATION_DELTA=120
JWT_ACCESS_EXPIRATION_DELTA=7
JWT_TOKEN_LOCATION=cookies
JWT_ACCESS_COOKIE_NAME=access_token
JWT_REFRESH_COOKIE_NAME=refresh_token
HASH_SCHEME=argon2
```

Important: if `.env` is missing, commands like `uv run alembic upgrade head` fail with `DbSettings` validation errors for `DB_HOST`, `DB_PORT`, etc.

## Local Setup (uv)

1. Install dependencies:

```bash
uv sync
```

2. Run migrations:

```bash
uv run alembic upgrade head
```

3. Start the API:

```bash
uv run uvicorn main:app --reload
```

API will be available at:

- `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

## Docker Setup

1. Build and start everything:

```bash
docker compose up --build
```

2. Stop containers:

```bash
docker compose down
```

3. Stop and remove database volume:

```bash
docker compose down -v
```

The API container runs migrations before starting Uvicorn.

## Common Commands

```bash
uv run alembic revision --autogenerate -m "describe-change"
uv run alembic upgrade head
uv run alembic downgrade -1
```
