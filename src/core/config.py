from fastapi.params import Security
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class SecuritySettings(BaseSettings):
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_REFRESH_EXPIRATION_DELTA: int = 120
    JWT_ACCESS_EXPIRATION_DELTA: int = 7
    JWT_TOKEN_LOCATION: str = "cookies"
    JWT_ACCESS_COOKIE_NAME: str = "access_token"
    JWT_REFRESH_COOKIE_NAME: str = "refresh_token"
    HASH_SCHEME: str = "argon2"

    model_config = SettingsConfigDict(env_file=Path(__file__).parent / ".env", env_file_encoding="utf-8")


security_settings = SecuritySettings()