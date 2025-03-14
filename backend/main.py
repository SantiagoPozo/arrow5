# arrow5/backend/main.py
import uuid
from typing import List
from pydantic import Field
from pydantic import BaseModel
from fastapi import FastAPI, WebSocket

app = FastAPI()

games = {}

class Game(BaseModel):
    id: str
    player1: str = None
    secret1: list[str] = Field(default_factory=lambda: [None]*5)
    player2: str = None
    secret2: list[str] = Field(default_factory=lambda: [None]*5)

@app.get("/")
async def root():
    return {"message": "Hello, Arrow 5!"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")

@app.post("/games")
async def create_game():
    game_id = str(uuid.uuid4())
    game = Game(id=game_id)
    games[game_id] = game
    return game
