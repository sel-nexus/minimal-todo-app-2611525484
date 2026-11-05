import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

/** Render the in-session task list and its complete task lifecycle. */
function App() {
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState([]);
  const nextId = useRef(1);

  /** Add a task when the entered title contains non-whitespace text. */
  function addTask(event) {
    event.preventDefault();
    if (!inputValue.trim()) return;

    const task = {
      id: nextId.current,
      title: inputValue,
      completed: false,
    };
    nextId.current += 1;
    setTasks((currentTasks) => [...currentTasks, task]);
    setInputValue('');
  }

  /** Toggle completion for the task with the supplied identifier. */
  function toggleTask(taskId) {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )));
  }

  /** Remove only the task with the supplied identifier. */
  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  return (
    <main className="page-shell">
      <section className="todo-panel" aria-labelledby="page-title">
        <header className="page-header">
          <p className="kicker">A little room to think</p>
          <h1 id="page-title">Todo App</h1>
          <p className="intro">Keep the next few things in view. One step at a time.</p>
        </header>

        <form className="task-form" onSubmit={addTask}>
          <label className="visually-hidden" htmlFor="todo-input">Add a task</label>
          <input
            id="todo-input"
            data-testid="todo-input"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="What needs doing?"
            autoComplete="off"
          />
          <button data-testid="add-button" type="submit">Add task</button>
        </form>

        {tasks.length === 0 ? (
          <p className="empty-state" data-testid="empty-state">No tasks yet.</p>
        ) : (
          <ul className="todo-list" data-testid="todo-list" aria-label="Tasks">
            {tasks.map((task) => (
              <li className="todo-item" data-testid={`todo-item-${task.id}`} key={task.id}>
                <label className="task-label">
                  <input
                    className="task-checkbox"
                    data-testid={`todo-checkbox-${task.id}`}
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span
                    className={`task-title${task.completed ? ' is-complete' : ''}`}
                    data-testid={`todo-title-${task.id}`}
                    style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                  >
                    {task.title}
                  </span>
                </label>
                <button
                  className="delete-button"
                  data-testid={`todo-delete-${task.id}`}
                  type="button"
                  aria-label={`Delete ${task.title}`}
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer className="panel-footer">
          <span>{tasks.length === 1 ? '1 task' : `${tasks.length} tasks`}</span>
          <span className="session-note">This list lives in this session</span>
        </footer>
      </section>
    </main>
  );
}

App.propTypes = {};

export default App;
