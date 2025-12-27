from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, schemas, database, auth
import app.websocket
import webbrowser

# Initialize DB Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

origins = [
    "http://localhost:5173",  
    "http://localhost:3000", 
    "https://project-management-app-trello-frontend.onrender.com" 
]
# Allow React to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origins], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    webbrowser.open("http://127.0.0.1:8000/docs")

# --- AUTH ENDPOINTS ---
@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- BOARD ENDPOINTS ---
@app.post("/boards", response_model=schemas.Board)
def create_board(board: schemas.BoardCreate, db: Session = Depends(database.get_db), current_user_email: str = Depends(auth.get_current_user)):
    user = db.query(models.User).filter(models.User.email == current_user_email).first()
    new_board = models.Board(title=board.title, owner_id=user.id)
    db.add(new_board)
    db.commit()
    db.refresh(new_board)
    return new_board

@app.get("/boards", response_model=list[schemas.Board])
def read_boards(db: Session = Depends(database.get_db), current_user_email: str = Depends(auth.get_current_user)):
    user = db.query(models.User).filter(models.User.email == current_user_email).first()
    return db.query(models.Board).filter(models.Board.owner_id == user.id).all()

# --- COLUMN ENDPOINTS ---
@app.post("/columns", response_model=schemas.Column)
def create_column(column: schemas.ColumnCreate, db: Session = Depends(database.get_db), current_user_email: str = Depends(auth.get_current_user)):
    # Using models.BoardList to match your renaming in models.py
    new_column = models.BoardList(title=column.title, position=column.position, board_id=column.board_id)
    db.add(new_column)
    db.commit()
    db.refresh(new_column)
    return new_column

@app.post("/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(database.get_db), current_user_email: str = Depends(auth.get_current_user)):
    new_task = models.Task(content=task.content, position=task.position, column_id=task.column_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.put("/tasks/{task_id}/move")
def move_task(task_id: int, move_data: schemas.TaskMove, db: Session = Depends(database.get_db), current_user_email: str = Depends(auth.get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.column_id = move_data.column_id
    task.position = move_data.position
    db.commit()
    return {"msg": "Task moved"}

@app.websocket("/ws/{board_id}")
async def websocket_endpoint(websocket: WebSocket, board_id: int):
    await manager.connect(websocket, board_id)
    try:
        while True:
            data = await websocket.receive_text()
            
            if data == "UPDATE":
                await manager.broadcast("REFRESH_BOARD", board_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, board_id)

@app.get("/boards/{board_id}/analytics")
def get_board_analytics(board_id: int, 
                        db: Session = Depends(database.get_db),
                        current_user_email: str = Depends(auth.get_current_user)):
    
    board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    stats = {}
    for column in board.columns:
        stats[column.title] = len(column.tasks)
    
    return stats