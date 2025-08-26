# Todo List App with Elmish Architecture and PHP Backend

This project is a simple, interactive Todo List application implemented using **JavaScript** and inspired by the **Elmish** architecture.
It now includes a **PHP + SQLite backend** for persistence, allowing todos to remain saved across page reloads.

It demonstrates state management, event-driven updates, a clean separation of concerns between **Model**, **Update**, and **View**, and backend communication.

---

## Screenshot

![alt text](Screenshot 2025-08-26 161743.png)
*Example of the app with todos, inline editing, and completed tasks.*

---

## Table of Contents

* [Features](#features)
* [Getting Started](#getting-started)
* [Backend Setup](#backend-setup)
* [Project Structure](#project-structure)
* [Elmish Architecture Overview](#elmish-architecture-overview)
* [Code Examples](#code-examples)
* [Technologies Used](#technologies-used)
* [Running Instructions](#running-instructions)
* [Running Locally / Lokal starten](#running-locally--lokal-starten)
* [Database](#database)
* [Deployment](#deployment)
* [Author](#author)

---

## Features

* Add, edit, and delete todo items
* Toggle completion status
* Delete all completed tasks
* Edit todo text inline
* Sleek, dark-themed UI with hover and focus effects
* Smooth button animations
* Persistent storage via **PHP + SQLite backend**

---

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Make sure you have **PHP** installed locally (or XAMPP for Windows).

3. Start the PHP server in the project folder:

```bash
cd todo-app
php -S localhost:8000
```

4. Open your browser and navigate to:

```
http://localhost:8000/index.html
```

Todos are now stored persistently in the SQLite database.

---

## Backend Setup

The backend uses **PHP** and **SQLite**:

* `backend.php` handles all CRUD operations:

  * `action=get` → fetch all todos
  * `action=add` → add a new todo (returns assigned `id`)
  * `action=toggle` → toggle completion by todo **ID**
  * `action=delete` → delete a specific todo by **ID**
  * `action=delete_completed` → delete all completed todos
  * `action=save` → update text of a todo by **ID**

* `todos.db` stores todos in a SQLite table:

```sql
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  completed INTEGER DEFAULT 0
);
```

* JavaScript `dispatch` calls the backend using `fetch()` after updating the local model, keeping the UI responsive while syncing with the database.

---

## Project Structure

The application follows an **Elmish-inspired architecture** with three main parts:

### Model

Represents the application state, including the list of todos:

```javascript
function init() {
  return {
    todos: [] // Each todo: { id, text, completed, editing, new }
  };
}
```

### Update

Handles all messages/events, updating the model immutably. All actions are now **ID-based**:

```javascript
function update(msg, model, payload) {
  switch(msg) {
    case MSG.ADD_TODO:
      return { ...model, todos: [...model.todos, { id: payload.id, text: payload.text, completed: false, editing: false, new: true }] };
    case MSG.TOGGLE_TODO:
      return { ...model, todos: model.todos.map(todo => todo.id === payload ? { ...todo, completed: !todo.completed } : todo) };
    case MSG.DELETE_TODO:
      return { ...model, todos: model.todos.filter(todo => todo.id !== payload) };
    case MSG.DELETE_COMPLETED:
      return { ...model, todos: model.todos.filter(todo => !todo.completed) };
    case MSG.EDIT_TODO:
      return { ...model, todos: model.todos.map(todo => todo.id === payload ? { ...todo, editing: !todo.editing } : todo) };
    case MSG.SAVE_TODO:
      return { ...model, todos: model.todos.map(todo => todo.id === payload.id ? { ...todo, text: payload.text, editing: false } : todo) };
  }
}
```

### View

Renders the UI and dispatches messages, using the **todo ID** for all backend interactions.

---

## Elmish Architecture Overview

1. **Model**: Holds the app state (`todos` array).
2. **Update**: Pure function computing new state from current state and messages.
3. **View**: Renders the UI from the model and dispatches messages from user actions.

This ensures **predictable, maintainable, and testable code**.

---

## Database

* **`todos.db`**: The main SQLite database used by the backend. Stores all todos persistently.
* **Structure:** Each todo has `id`, `text`, and `completed` columns.
* **`database.sqlite`**: Not used by the current backend; can be ignored or deleted.
* Backend automatically creates the table if it doesn’t exist.

---

## Running Locally / Lokal starten

#### English

1. Install XAMPP (or PHP).
2. Copy the project folder into `htdocs` (for XAMPP).
3. Start Apache.
4. Open `http://localhost/<your-project-folder>/`.

#### Deutsch

1. XAMPP installieren (oder PHP lokal).
2. Projektordner in `htdocs` kopieren.
3. Apache starten.
4. Browser öffnen: `http://localhost/<dein-projekt-ordner>/`.

---

## Deployment

* **Local:** PHP built-in server or XAMPP/MAMP/LAMP.
* **Online:** PHP-enabled hosting, upload all project files (`index.html`, `main.js`, `css`, `backend.php`, `todos.db`).
* **GitHub:** Version control only; GitHub Pages cannot run PHP.

---

## Author

Sandro Costa
