# app/models.py
from pydantic import BaseModel

class Game(BaseModel):
    player1: str
    player2: str
    board: list
    current_turn: str
    winner: str = None
