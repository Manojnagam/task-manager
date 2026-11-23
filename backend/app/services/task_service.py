from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Task, User
from app.schemas.task import TaskCreate, TaskUpdate


def create_task(db: Session, user: User, data: TaskCreate) -> Task:
    task = Task(title=data.title, description=data.description, owner_id=user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def list_tasks(db: Session, user: User, is_done: bool | None = None) -> list[Task]:
    query = (
        select(Task)
        .where(Task.owner_id == user.id)
        .order_by(Task.created_at.desc(), Task.id.desc())
    )
    if is_done is not None:
        query = query.where(Task.is_done == is_done)
    return list(db.scalars(query))


def get_task(db: Session, user: User, task_id: int) -> Task | None:
    return db.scalar(
        select(Task).where(Task.id == task_id, Task.owner_id == user.id)
    )


def update_task(db: Session, task: Task, data: TaskUpdate) -> Task:
    changes = data.model_dump(exclude_unset=True)
    for field, value in changes.items():
        if value is None and field in ("title", "is_done"):
            continue
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()