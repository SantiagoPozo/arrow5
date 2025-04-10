import uuid
from typing import List, Tuple, Dict
from pydantic import Field, BaseModel
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from random import sample
from constants import *  # Se espera que ALPH y LENGTH estén definidos


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

games = {}

class Game(BaseModel):
    id: str
    player: str = None
    gender: str = "none"  # Valor por defecto
    secret: str  # Asumimos que secret es una cadena
    attempts: List[str] = Field(default_factory=list)
    responses: List[str] = Field(default_factory=list)
    # Nueva estructura de clues: la clave es una tupla (attemptIndex, tileIndex)
    # y el valor es un diccionario con la pista resultante.
    clues: Dict[Tuple[int, int], Dict[str, str]] = Field(default_factory=dict)
    
@app.get("/")
async def root():
    return {"message": "Hello, Arrow 5!"}


class GameCreateRequest(BaseModel):
    playerName: str
    gender: str = "none"  # Add gender field with default value

@app.post("/games")
async def create_game(data: GameCreateRequest):
    game_id = str(uuid.uuid4())
    secret = generateCode(CODE_LENGTH)
    game = Game(
        id=game_id, 
        player=data.playerName,
        gender=data.gender, 
        secret=secret
    )
    games[game_id] = game
    return game

@app.get("/games/{game_id}")
async def get_game(game_id: str):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    return games[game_id]

# Nuevo endpoint para enviar un intento y evaluar
class AttemptRequest(BaseModel):
    attempt: str

@app.post("/games/{game_id}/attempt")
async def submit_attempt(game_id: str, data: AttemptRequest):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    game = games[game_id]
    try:
        result = evaluate(game.secret, data.attempt)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    # Actualizar el estado del juego (opcional)
    game.attempts.append(data.attempt)
    game.responses.append(result)
    print(game.secret)
    return {"result": result}

# Change from POST to GET and use query parameters
@app.get("/games/{game_id}/clue")
async def get_clue(game_id: str, attemptIndex: int, tileIndex: int):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    game = games[game_id]

# Only one clue per attempt
    # if attemptIndex in game.clues:
    #     raise HTTPException(status_code=400, detail="Clue for this attempt index has already been requested")
    # Validate the indexes
    if attemptIndex < 0 or attemptIndex >= len(game.attempts):
        raise HTTPException(status_code=400, detail="Invalid attempt index")
    
    attempt = game.attempts[attemptIndex]
    
    if tileIndex < 0 or tileIndex >= CODE_LENGTH:
        raise HTTPException(status_code=400, detail="Invalid tile index")
    
    # Crear la clave como tupla
    key: Tuple[int, int] = (attemptIndex, tileIndex)
    
    # Si esa pista ya fue solicitada, interrumpir el proceso
    if key in game.clues:
        raise HTTPException(
            status_code=400,
            detail="Clue for this attempt and tile has already been requested"
        )
    
    try:
        clue_str = clue(game.secret, attempt, tileIndex)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Actualizamos clues usando la nueva estructura:
    game.clues[key] = {"result": clue_str}
    print(game.clues)
    return {"clue": clue_str}

def generateCode(k: int) -> str:
    code = sample(ALPH[0:11], k)
    return "".join(code)

def evaluate(secret: str, attempt: str) -> str:
    if len(attempt) < CODE_LENGTH: 
        raise ValueError("Attempt needs to be 5 characters long")
    if len(attempt) == CODE_LENGTH and len(set(attempt)) < CODE_LENGTH:
        raise ValueError("Attempt needs to have 5 different characters")
    result = ""
    for i, a in enumerate(attempt):
        if a in set(secret):
            if a == secret[i]:
                result += "=" # s for steady
            else:
                #index of a in secret
                index = secret.index(a)
                if index < i:
                    result += "<"
                else:
                    result += ">"
    return result

def clue(secret: str, attempt: str, position: int) -> str:
    print(secret, attempt, position)

    symbol = attempt[position]
    if symbol not in secret:
        return "absent"
    real_position = secret.index(symbol)
    print(f"real position: {real_position}")
    if real_position == position:
        return "steady"
    elif real_position < position:
        return "left"
    else:
        return "right"

