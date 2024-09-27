from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Middleware (if needed for testing in the browser)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def get_home():
    with open("app/templates/index.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)

@app.get("/mode", response_class=HTMLResponse)
async def get_mode():
    with open("app/templates/mode.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)

@app.get("/difficulty", response_class=HTMLResponse)
async def get_difficulty():
    with open("app/templates/difficulty.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)

@app.get("/game_board", response_class=HTMLResponse)
async def get_game_board(difficulty: str):
    with open("app/templates/game_board.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)

@app.get("/two_players", response_class=HTMLResponse)
async def get_two_players():
    with open("app/templates/game_board.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)
