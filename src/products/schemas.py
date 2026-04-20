from pydantic import BaseModel, Field, HttpUrl, field_validator

class CreateProductFormSchema(BaseModel):
    name: str = Field(max_length=150, min_length=5)
    description: str = Field(max_length=1300, min_length=15)
    price: float = Field(default=0)
    image_url: HttpUrl = Field(default="https://img.freepik.com/free-vector/isometric-postal-parcels-mails_33099-720.jpg?semt=ais_hybrid&w=740&q=80")

class CreateProductDbSchema(BaseModel):
    name: str = Field(max_length=150, min_length=5)
    description: str = Field(max_length=1300, min_length=15)
    price: float = Field(default=0)
    image_url: str

    created_by_id: int

    model_config = {"from_attributes": True}

    @field_validator('image_url', mode='before')
    @classmethod
    def convert_url(cls, v):
        return str(v) if isinstance(v, HttpUrl) else v