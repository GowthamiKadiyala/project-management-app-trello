from pydantic import BaseModel, EmailStr

# What we expect when a user registers
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# What we send back to the user (no password!)
class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TaskBase(BaseModel):
    content: str
    position: float

class TaskCreate(TaskBase):
    content: str
    position: float
    column_id: int

class Task(TaskBase):
    id: int
    column_id: int
    class Config:
        from_attributes = True

class ColumnBase(BaseModel):
    title: str
    position: float

class ColumnCreate(ColumnBase):
    title: str
    position: float
    board_id: int  

class Column(ColumnBase):
    id: int
    tasks: list[Task] = []
    class Config:
        from_attributes = True

class BoardCreate(BaseModel):
    title: str

class Board(BaseModel):
    id: int
    title: str
    owner_id: int
    columns: list[Column] = []
    class Config:
        from_attributes = True

class TaskMove(BaseModel):
    column_id: int
    position: float