from pydantic import BaseModel, EmailStr, Field

class UserRegFormSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=64)
    first_name: str = Field(max_length=25)
    last_name: str | None = Field(max_length=25)
    is_entrepreneur: bool = Field(default=False)
    in_club: bool = Field(default=False)

class AddUserSchema(BaseModel):
    email: EmailStr
    hashed_password: str
    first_name: str
    last_name: str | None
    is_entrepreneur: bool
    in_club: bool

class UserLoginFormSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=64)

class UserLoginResponseSchema(BaseModel):
    access_token: str
    refresh_token: str

class TokensSchema(BaseModel):
    access_token: str
    refresh_token: str
