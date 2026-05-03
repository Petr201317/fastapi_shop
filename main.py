from fastapi import FastAPI
import uvicorn
from src.api import router as api_routers
import src.db.models  # noqa: F401

app = FastAPI()

app.include_router(api_routers)

if __name__ == "__main__":
    uvicorn.run(app)
