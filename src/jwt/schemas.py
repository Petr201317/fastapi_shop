from pydantic import BaseModel


class AddRefreshJWTSchema(BaseModel):
    token: str
    user_id: int

class AccessTokenDataSchema(BaseModel):
    in_club: bool
    is_entrepreneur: bool