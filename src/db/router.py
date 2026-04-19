from fastapi import APIRouter
from .database import init_database

router = APIRouter(prefix="/init-db")

@router.post("/")
async def init_db():
    tables = init_database()
    return {"message": "Db initialized", "tables": tables}






