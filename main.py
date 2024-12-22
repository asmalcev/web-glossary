from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
import uvicorn

DATABASE_FILE = 'glossary.db'

class Term(BaseModel):
    term: str
    description: str

    class Config:
        from_attributes = True

class GlossaryDB:
    def __init__(self):
        self.conn = sqlite3.connect(DATABASE_FILE)
        self.conn.execute("CREATE TABLE IF NOT EXISTS terms (term TEXT PRIMARY KEY, description TEXT)")

    def add_term(self, term: Term):
        self.conn.execute("INSERT INTO terms (term, description) VALUES (?, ?)", (term.term, term.description))
        self.conn.commit()

    def get_terms(self):
        cursor = self.conn.execute("SELECT * FROM terms")
        return [Term(term=row[0], description=row[1]) for row in cursor.fetchall()]

    def get_term(self, keyword: str):
        cursor = self.conn.execute("SELECT * FROM terms WHERE term = ?", (keyword,))
        result = cursor.fetchone()
        if result:
            return Term(term=result[0], description=result[1])
        return None

    def update_term(self, keyword: str, term: Term):
        self.conn.execute("UPDATE terms SET description = ? WHERE term = ?", (term.description, keyword))
        self.conn.commit()

    def delete_term(self, keyword: str):
        self.conn.execute("DELETE FROM terms WHERE term = ?", (keyword,))
        self.conn.commit()

app = FastAPI()
glossary_db = GlossaryDB()

@app.get("/terms", response_model=list[Term])
async def get_terms():
    return glossary_db.get_terms()

@app.get("/term/{keyword}", response_model=Term)
async def get_term(keyword: str):
    term = glossary_db.get_term(keyword)
    return term

@app.post("/terms", response_model=Term)
async def add_term(term: Term):
    glossary_db.add_term(term)
    return term

@app.put("/term/{keyword}", response_model=Term)
async def update_term(keyword: str, term: Term):
    glossary_db.update_term(keyword, term)
    return term

@app.delete("/term/{keyword}")
async def delete_term(keyword: str):
    glossary_db.delete_term(keyword)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000)