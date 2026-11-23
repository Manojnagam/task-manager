import { useEffect, useState } from "react";
import { createTask, deleteTask, listTasks, updateTask } from "./api";

export default function TasksPage({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function handleError(err) {
    if (err.status === 401) {
      onLogout();
      return;
    }
    setError(err.message);
  }

  useEffect(() => {
    async function load() {
      try {
        setTasks(await listTasks());
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd(event) {
    event.preventDefault();
    setError("");
    try {
      const newTask = await createTask(title.trim(), description.trim() || null);
      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      handleError(err);
    }
  }

  async function handleToggle(task) {
    setError("");
    try {
      const updated = await updateTask(task.id, { is_done: !task.is_done });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      handleError(err);
    }
  }

  async function handleDelete(task) {
    setError("");
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <div>
      <div className="topbar">
        <h2>My tasks</h2>
        <button className="secondary" onClick={onLogout}>
          Log out
        </button>
      </div>

      <form className="card" onSubmit={handleAdd}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add task</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="empty">No tasks yet. Add your first one above.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.is_done ? "task done" : "task"}>
              <input
                type="checkbox"
                checked={task.is_done}
                onChange={() => handleToggle(task)}
              />
              <div className="task-text">
                <strong>{task.title}</strong>
                {task.description && <span>{task.description}</span>}
              </div>
              <button className="danger" onClick={() => handleDelete(task)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}