from passlib.context import CryptContext
from .config import security_settings
from src.jwt.schemas import AccessTokenDataSchema
from authx import AuthXConfig, RequestToken, AuthX
import datetime

pwd_context = CryptContext(schemes=[security_settings.HASH_SCHEME], deprecated="auto")
jwt_config = AuthXConfig(
    JWT_SECRET_KEY=security_settings.JWT_SECRET_KEY,  # Change this!
    JWT_TOKEN_LOCATION=[security_settings.JWT_TOKEN_LOCATION],
    JWT_ACCESS_COOKIE_NAME=security_settings.JWT_ACCESS_COOKIE_NAME,
    JWT_REFRESH_COOKIE_NAME=security_settings.JWT_REFRESH_COOKIE_NAME,
    JWT_REFRESH_TOKEN_EXPIRES=security_settings.JWT_REFRESH_EXPIRATION_DELTA,
    JWT_COOKIE_CSRF_PROTECT=False
)

jwt_authx = AuthX(jwt_config)



def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def generate_refresh_token(user_id: int) -> str:
    return jwt_authx.create_refresh_token(uid=str(user_id), expiry=datetime.timedelta(days=security_settings.JWT_REFRESH_EXPIRATION_DELTA))

def generate_access_token(data: AccessTokenDataSchema, user_id: int) -> str:
    return jwt_authx.create_access_token(data=data.model_dump(), uid=str(user_id), expiry=datetime.timedelta(minutes=security_settings.JWT_ACCESS_EXPIRATION_DELTA))

def verify_token(token: RequestToken) -> AccessTokenDataSchema:
    return jwt_authx.verify_token(token=token, verify_csrf=False, verify_type=False)



