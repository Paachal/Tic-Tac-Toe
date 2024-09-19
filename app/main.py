# app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.requests import Request
from app.auth import router as auth_router, oauth2_scheme
from app.models import Game
from pydantic import BaseModel

app = FastAPI()

templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(auth_router, prefix="/auth", tags=["auth"])

games = {}

class Move(BaseModel):
    game_id: str
    row: int
    col: int
    player: str

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/game/{mode}")
async def get_game(request: Request, mode: str, token: str = Depends(oauth2_scheme)):
    if mode not in ["local", "nearby", "online"]:
        return {"error": "Invalid game mode"}
    return templates.TemplateResponse("game.html", {"request": request, "mode": mode})

@app.post("/game/start")
async def start_game(player1: str, player2: str, mode: str, token: str = Depends(oauth2_scheme)):
    game_id = len(games) + 1
    games[game_id] = Game(
        player1=player1,
        player2=player2,
        board=[["" for _ in range(3)] for _ in range(3)],
        current_turn=player1
    )
    return {"game_id": game_id}

@app.post("/game/move")
async def make_move(move: Move, token: str = Depends(oauth2_scheme)):
    game = games.get(move.game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    if game.current_turn != move.player:
        raise HTTPException(status_code=400, detail="Not your turn")
    if game.board[move.row][move.col] != "":
        raise HTTPException(status_code=400, detail="Cell already occupied")
    game.board[move.row][move.col] = "X" if move.player == game.player1 else "O"
    game.current_turn = game.player2 if move.player == game.player1 else game.player1
    # Check for winner logic here...
    return {"board": game.board}
