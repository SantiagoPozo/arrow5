# arrow5/backend/main.py
import uuid
from typing import List
from pydantic import Field
from pydantic import BaseModel
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from random import sample
from constants import *

app = FastAPI()

origins = [
    "http://localhost:5173",   # Puerto donde corre tu frontend
    "http://127.0.0.1:5173"    # Alternativa si accedes con 127.0.0.1
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # o especifica los métodos que uses: ["GET", "POST"]...
    allow_headers=["*"],
)

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
    secret = generateCode(5)
    game = Game(id=game_id, secret=secret)
    games[game_id] = game
    return game

def generateCode(k):
    return sample(ALPH[:11], k)

