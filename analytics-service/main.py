import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from sqlmodel import Field, Session, SQLModel, create_engine, select
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Database Setup
DB_FILE = os.getenv("DATABASE_URL", "analytics.sqlite")
sqlite_url = f"sqlite:///{DB_FILE}"
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

# Model Definition
class Visit(SQLModel, table=True):
    short_code: str = Field(primary_key=True)
    count: int = Field(default=1)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# API Implementation
class VisitRequest(SQLModel):
    shortCode: str

@app.post("/visit")
async def log_visit(request: VisitRequest):
    with Session(engine) as session:
        visit = session.get(Visit, request.shortCode)
        if not visit:
            visit = Visit(short_code=request.shortCode, count=1)
            session.add(visit)
        else:
            visit.count += 1
            session.add(visit)
        session.commit()
        session.refresh(visit)
        return {"status": "success", "shortCode": visit.short_code, "count": visit.count}

@app.get("/stats")
async def get_stats():
    with Session(engine) as session:
        statement = select(Visit)
        results = session.exec(statement).all()
        return [{"shortCode": row.short_code, "count": row.count} for row in results]

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 4003))
    uvicorn.run(app, host="0.0.0.0", port=port)
