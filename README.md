# Amazon Clone API

Modern e-commerce API built with FastAPI, PostgreSQL, and JWT authentication.

## Tech Stack

- **Python 3.14** — Programming language
- **FastAPI** — Web framework
- **SQLAlchemy 2.0** — Async ORM
- **PostgreSQL** — Database
- **AuthX** — JWT authentication
- **Argon2** — Password hashing

## Project Structure

```
amazone-clone/
├── src/
│   ├── api.py              # Router aggregation
│   ├── auth/              # Authentication & users
│   │   ├── depends.py     # FastAPI dependencies
│   │   ├── models.py     # SQLAlchemy models
│   │   ├── repo.py      # Repository (DB queries)
│   │   ├── router.py    # API endpoints
│   │   ├── schemas.py   # Pydantic schemas
│   │   └── services.py  # Business logic
│   ├── core/            # Configuration & security
│   │   ├── config.py   # Settings
│   │   └── security.py # Hashing, JWT
│   ├── db/              # Database
│   │   ├── config.py   # DB configuration
│   │   ├── database.py # SQLAlchemy engines
│   │   └── router.py  # DB initialization
│   └── jwt/             # JWT tokens
│       ├── depends.py  # Token dependencies
│       ├── models.py  # Token models
│       ├── repo.py   # Token repository
│       ├── schemas.py # Token schemas
│       └── service.py # Token creation
├── main.py              # Entry point
└── pyproject.toml     # Dependencies
```

## Quick Start

### 1. Installation

```bash
# Install dependencies
pip install -e .
```

### 2. Environment Variables

Create `.env` in `src/db/`:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=shop-db
```

Create `.env` in `src/core/`:

```
JWT_SECRET_KEY=your-secret-key-at-least-32-characters
JWT_ALGORITHM=HS256
JWT_REFRESH_EXPIRATION_DELTA=120
JWT_ACCESS_EXPIRATION_DELTA=7
JWT_TOKEN_LOCATION=cookies
JWT_ACCESS_COOKIE_NAME=access_token
JWT_REFRESH_COOKIE_NAME=refresh_token
HASH_SCHEME=argon2
```

### 3. Run the Server

```bash
# Using uvicorn
uvicorn main:app --reload

# Or using Python
python main.py
```

Server starts at `http://localhost:8000`

## API Endpoints

### Initialize Database

```http
POST /init-db/
```

Creates all tables in the database.

### Register

```http
POST /auth/reg
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securepassword",
    "first_name": "John",
    "last_name": "Doe",
    "is_entrepreneur": false,
    "in_club": false
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securepassword"
}
```

Response:
```json
{
    "access_token": "eyJ...",
    "refresh_token": "eyJ..."
}
```

Tokens are automatically set in cookies.

### Get Current User

```http
GET /auth/me
```

Requires authentication (token in cookies).

Response:
```json
{
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "in_club": false,
    "is_entrepreneur": false
}
```

## Architecture

### Repository + Service Pattern

```
Router → Service → Repository → Database
  ↓         ↓          ↓
Depends  Business   SQLAlchemy
         Logic      Queries
```

### Dependency Injection

FastAPI manages dependencies via `Depends()`:

```python
async def get_auth_service(
    repo: UsersRepository = Depends(get_users_repository),
    jwt_service: JWTService = Depends(get_jwt_service)
):
    return AuthService(repo, jwt_service)
```

### Async Database

All DB operations use async/await:

```python
async def add_user(self, user_data):
    async with self.session() as session:
        stmt = insert(User).values(...)
        await session.execute(stmt)
        await session.commit()
```

## Security Configuration

### Password Hashing

Uses Argon2 — modern and secure:

```python
from src.core.security import hash_password, verify_password

hashed = hash_password("password123")
verify_password("password123", hashed)  # True
```

### JWT Tokens

- **Access token** — short-term authentication (7 minutes default)
- **Refresh token** — refresh access token (120 days default)

Tokens stored in cookies with `HttpOnly`, `Secure` and `SameSite` flags.

## Testing

```bash
# Run all tests
pytest

# Run specific file
pytest tests/test_auth.py
```

## Useful Commands

```bash
# Create migration (if using Alembic)
alembic revision --autogenerate -m "add_users_table"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Open REPL
python -c "import src.api; print(src.api.app)"
```

## Environment Variables

### db/.env

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_USER | Database user | postgres |
| DB_PASS | Database password | postgres |
| DB_NAME | Database name | shop-db |

### core/.env

| Variable | Description | Default |
|----------|-------------|---------|
| JWT_SECRET_KEY | Secret key for token signing | - |
| JWT_ALGORITHM | Signing algorithm | HS256 |
| JWT_REFRESH_EXPIRATION_DELTA | Days for refresh token | 120 |
| JWT_ACCESS_EXPIRATION_DELTA | Minutes for access token | 7 |
| JWT_TOKEN_LOCATION | Where to store token | cookies |
| JWT_ACCESS_COOKIE_NAME | Access cookie name | access_token |
| JWT_REFRESH_COOKIE_NAME | Refresh cookie name | refresh_token |
| HASH_SCHEME | Hashing algorithm | argon2 |

## Production Recommendations

1. **Change JWT_SECRET_KEY** to random string (min 32 characters)
2. **HTTPS** is required in production
3. **Configure cookie flags**: `Secure=True`, `SameSite=Lax`
4. **Use connection pooling** for PostgreSQL
5. **Add logging** and monitoring
6. **Rate limiting** to protect against brute force

## License

MIT License