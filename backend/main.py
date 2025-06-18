import uuid
from typing import List, Tuple, Dict
from pydantic import Field, BaseModel
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from random import sample
from constants import *  # Se espera que ALPH y CODE_LENGTH estén definidos

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
    secret: str  
    difficulty: str
    obfuscation: bool
    solved: bool = False  # Nuevo campo para rastrear si el juego ha sido resuelto
    attempts: List[str] = Field(default_factory=list)
    responses: List[str] = Field(default_factory=list)
    clues: Dict[Tuple[int, int], Dict[str, str]] = Field(default_factory=dict)
    
@app.get("/")
async def root():
    return {"message": "Hello, Arrow 5!"}


class GameCreateRequest(BaseModel):
    playerName: str
    difficulty: str
    obfuscation: bool

@app.post("/games")
async def create_game(data: GameCreateRequest):
    game_id = str(uuid.uuid4())
    secret = generateCode(CODE_LENGTH, data.obfuscation)
    game = Game(
        id=game_id, 
        secret=secret,
        difficulty=data.difficulty,
        obfuscation=data.obfuscation,
        solved=False,  # Inicialmente no está resuelto
    )
    games[game_id] = game
    print("\n\nGame created:", game_id)
    print("secret", game.secret)
    print("game", game)
    return game.id

@app.get("/games/{game_id}")
async def get_game(game_id: str):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    game = games[game_id]
    # Convertir las claves de game.clues a strings, por ejemplo "attemptIndex_tileIndex"
    clues_serializable = { f"{key[0]}_{key[1]}": value for key, value in game.clues.items() }
    return {
        "id": game.id,
        "attempts": game.attempts,
        "responses": game.responses,
        "clues": clues_serializable,
        "solved": game.solved
    }

class AttemptRequest(BaseModel):
    attempt: str

@app.post("/games/{game_id}/attempt")
async def submit_attempt(game_id: str, data: AttemptRequest):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    game = games[game_id]
    try:
        result, is_solved = evaluate(game.secret, data.attempt, game.obfuscation)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    game.attempts.append(data.attempt)
    game.responses.append(result)
    
    # Actualizamos el estado de resolución del juego
    if is_solved:
        game.solved = True
        
    print(game.secret)
    return {"result": result, "solved": is_solved}

@app.get("/games/{game_id}/clue")
async def get_clue(game_id: str, attemptIndex: int, tileIndex: int):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    game = games[game_id]
    
    # Validar índices
    if attemptIndex < 0 or attemptIndex >= len(game.attempts):
        raise HTTPException(status_code=400, detail="Invalid attempt index")
    
    if tileIndex < 0 or tileIndex >= CODE_LENGTH:
        raise HTTPException(status_code=400, detail="Invalid tile index")
    
    # Validar límites de pistas según la dificultad
    if game.difficulty == "0":
        raise HTTPException(status_code=400, detail="No clues allowed for this difficulty")
    elif game.difficulty == "1":
        if game.clues:  
            raise HTTPException(status_code=400, detail="Only one clue allowed for this game")
    elif game.difficulty == "n":
        clues_for_attempt = [k for k in game.clues.keys() if k[0] == attemptIndex]
        if clues_for_attempt:
            raise HTTPException(status_code=400, detail="Only one clue allowed per attempt")


    # Crear la clave como tupla
    key: Tuple[int, int] = (attemptIndex, tileIndex)
    
    if key in game.clues:
        raise HTTPException(
            status_code=400,
            detail="Clue for this attempt and tile has already been requested"
        )
    try:
        clue_str = clue(game.secret, game.attempts[attemptIndex], tileIndex)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Almacenar la pista
    game.clues[key] = {"result": clue_str}
    print(game.clues)
    return {"clue": clue_str}

def generateCode(k: int, obfuscation: bool = False) -> str:
    # Si hay obfuscación, se incluye la letra 'y' en el conjunto de caracteres posibles
    if obfuscation:
        code = sample(ALPH[0:12], k)  # Incluye 'y' (índice 11)
    else:
        code = sample(ALPH[0:11], k)  # Sin 'y'
    return "".join(code)

def evaluate(secret: str, attempt: str, obfuscation: bool = False) -> Tuple[str, bool]:
    if len(attempt) < CODE_LENGTH: 
        raise ValueError("Attempt needs to be 5 characters long")
    if len(attempt) == CODE_LENGTH and len(set(attempt)) < CODE_LENGTH:
        raise ValueError("Attempt needs to have 5 different characters")
    
    # Verificamos inmediatamente si el intento es igual al secreto
    if secret == attempt:
        return ("=" * CODE_LENGTH, True)
    
    result = ""
    
    for i, a in enumerate(attempt):
        
        if obfuscation:
            if a == 'y':
                continue
                
            if a == 'x':
                result += "="
                continue
        
        # Comportamiento normal para otros caracteres
        if a in set(secret):
            if a == secret[i]:
                result += "="  # steady symbol
            else:
                index = secret.index(a)
                if index < i:
                    result += "<"
                else:
                    result += ">"
    
    return (result, False)

def clue(secret: str, attempt: str, position: int) -> str:
    print("\033[32m\n\nClue requested\033[0m")
    print("secret   ", "attempt  ", "position ")
    print(f"{secret:10}{attempt:10}{position}")

    result = "absent"
    symbol = attempt[position]
    if symbol in secret:
        real_position = secret.index(symbol)
        print(f"  real position: {real_position}")
        if real_position == position:
            result = "steady"
        elif real_position < position:
            result = "left"
        else:
            result = "right"
    return result

