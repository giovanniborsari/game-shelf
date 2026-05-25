from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Game Shelf is running!"}