from datetime import datetime

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    is_done: bool | None = None


class TaskOut(BaseModel):
    id: int
    title: str
    description: str | None
    is_done: bool
    created_at: datetime

    model_config = {"from_attributes": True}