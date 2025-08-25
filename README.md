# Todo List App with Elmish Architecture

This project is a simple, interactive Todo List application implemented using **JavaScript** and inspired by the **Elmish** architecture.

It demonstrates state management, event-driven updates, and a clean separation of concerns between **Model**, **Update**, and **View**.

---

## Table of Contents

* [Features](#features)
* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [Elmish Architecture Overview](#elmish-architecture-overview)
* [Code Examples](#code-examples)
* [Technologies Used](#technologies-used)
* [Author](#author)

---

## Features

* Add, edit, and delete todo items
* Toggle completion status
* Delete all completed tasks
* Sleek, dark-themed UI with hover and focus effects
* Smooth button animations

---

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Open `index.html` in your browser.

No additional build steps are required, as the app is pure JavaScript.

---

## Project Structure

The application follows a simple Elmish-like architecture with three main parts:

### Model

Represents the state of the application. In this case, it's an object containing a `todos` array:

```javascript
function init() {
    return {
        todos: []
    };
}
```

### Update

Handles all messages (events) and updates the model immutably.

```javascript
function update(msg, model, payload) {
    switch (msg) {
        case MSG.ADD_TODO:
            return {
                ...model,
                todos: [...model.todos, { text: payload, completed: false, editing: false, new: true }]
            };
        case MSG.TOGGLE_TODO:
            return {
                ...model,
                todos: model.todos.map((todo, index) =>
                    index === payload ? { ...todo, completed: !todo.completed } : todo
                )
            };
        // Other cases...
    }
}
```

### View

Renders the UI based on the current model and dispatches messages on user interactions.

```javascript
function view(model, dispatch) {
    const container = document.createElement('div');
    const ul = document.createElement('ul');
    model.todos.forEach((todo, index) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('click', () => dispatch(MSG.TOGGLE_TODO, index));
        li.appendChild(checkbox);
        container.appendChild(ul);
    });
    return container;
}
```

This separation ensures a predictable and maintainable code structure.

---

## Elmish Architecture Overview

The **Elmish** architecture is inspired by the Elm programming language and follows a simple unidirectional data flow:

1. **Model**: The state of the application.
2. **Update**: Pure functions that take a message and the current state to return a new state.
3. **View**: A function that renders the UI from the current state and dispatches messages based on user input.

This approach makes state changes predictable and easier to debug.

---

## Technologies Used

* JavaScript (ES6+)
* HTML & CSS
* Elmish-inspired architecture pattern

---

## Author

Sandro Costa

---

## German Version

# Todo-Liste App mit Elmish-Architektur

Dieses Projekt ist eine einfache, interaktive Todo-Liste-App, die mit **JavaScript** implementiert und von der **Elmish-Architektur** inspiriert ist.

Sie demonstriert Zustandsverwaltung, ereignisgesteuerte Updates und eine saubere Trennung zwischen **Model**, **Update** und **View**.

## Funktionen

* Hinzufügen, Bearbeiten und Löschen von Todos
* Umschalten des Status von erledigt/nicht erledigt
* Löschen aller erledigten Aufgaben
* Dunkles, elegantes UI mit Hover- und Fokus-Effekten
* Sanfte Button-Animationen

## Projektstruktur

### Model

Repräsentiert den Zustand der App:

```javascript
function init() {
    return {
        todos: []
    };
}
```

### Update

Verarbeitet Nachrichten und aktualisiert das Model unveränderlich:

```javascript
function update(msg, model, payload) {
    switch (msg) {
        case MSG.ADD_TODO:
            return {
                ...model,
                todos: [...model.todos, { text: payload, completed: false, editing: false, new: true }]
            };
        // Weitere Fälle...
    }
}
```

### View

Rendert die UI basierend auf dem aktuellen Model und dispatcht Nachrichten bei Benutzerinteraktionen:

```javascript
function view(model, dispatch) {
    const container = document.createElement('div');
    const ul = document.createElement('ul');
    model.todos.forEach((todo, index) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('click', () => dispatch(MSG.TOGGLE_TODO, index));
        li.appendChild(checkbox);
        container.appendChild(ul);
    });
    return container;
}
```

### Elmish-Architektur

Elmish ist inspiriert von der Elm-Programmiersprache und folgt einem unidirektionalen Datenfluss:

1. **Model**: Der Zustand der Anwendung.
2. **Update**: Reine Funktionen, die eine Nachricht und den aktuellen Zustand verarbeiten und einen neuen Zustand zurückgeben.
3. **View**: Eine Funktion, die die UI aus dem aktuellen Zustand rendert und Nachrichten basierend auf Benutzeraktionen dispatcht.

Diese Trennung sorgt für vorhersehbare und wartbare Zustandsänderungen.

---

## Technologien

* JavaScript (ES6+)
* HTML & CSS
* Elmish-inspiriertes Architekturpattern

## Autor

Sandro Costa
