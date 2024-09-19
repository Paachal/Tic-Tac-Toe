# app/main.py
from fastapi import FastAPI, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.auth import router as auth_router, get_current_user

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

app.include_router(auth_router, prefix="/auth")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/game/{mode}", response_class=HTMLResponse)
async def game(request: Request, mode: str, user: str = Depends(get_current_user)):
    return templates.TemplateResponse("game.html", {"request": request, "mode": mode, "user": user})
