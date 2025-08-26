const MSG = {
    ADD_TODO: 'ADD_TODO',
    TOGGLE_TODO: 'TOGGLE_TODO',
    DELETE_TODO: 'DELETE_TODO',
    DELETE_COMPLETED: 'DELETE_COMPLETED',
    EDIT_TODO: 'EDIT_TODO',
    SAVE_TODO: 'SAVE_TODO'
};

function init() {
    return {
        todos: [] // Each todo: { id, text, completed, editing, new }
    };
}

function update(msg, model, payload) {
    switch (msg) {
        case MSG.ADD_TODO:
            if (!payload || !payload.text.trim()) return model;
            return {
                ...model,
                todos: [...model.todos, { id: payload.id, text: payload.text, completed: false, editing: false, new: true }]
            };

        case MSG.TOGGLE_TODO:
            return {
                ...model,
                todos: model.todos.map(todo =>
                    todo.id === payload ? { ...todo, completed: !todo.completed } : todo
                )
            };

        case MSG.DELETE_TODO:
            return {
                ...model,
                todos: model.todos.filter(todo => todo.id !== payload)
            };

        case MSG.DELETE_COMPLETED:
            return {
                ...model,
                todos: model.todos.filter(todo => !todo.completed)
            };

        case MSG.EDIT_TODO:
            return {
                ...model,
                todos: model.todos.map(todo =>
                    todo.id === payload ? { ...todo, editing: !todo.editing } : todo
                )
            };

        case MSG.SAVE_TODO:
            return {
                ...model,
                todos: model.todos.map(todo =>
                    todo.id === payload.id ? { ...todo, text: payload.text, editing: false } : todo
                )
            };

        default:
            return model;
    }
}

function view(model, dispatch) {
    const container = document.createElement('div');

    const title = document.createElement('h3');
    title.innerText = 'My Todos:';
    container.appendChild(title);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'new-todo';
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            dispatch(MSG.ADD_TODO, { text: input.value });
            input.value = '';
        }
    });
    container.appendChild(input);

    const ul = document.createElement('ul');

    const todosWithIndex = model.todos.map((todo, index) => ({ ...todo, origIndex: index }));
    const sortedTodos = todosWithIndex.sort((a, b) => {
        if (a.completed === b.completed) return a.origIndex - b.origIndex;
        return a.completed - b.completed;
    });

    sortedTodos.forEach(todo => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('click', () => dispatch(MSG.TOGGLE_TODO, todo.id));
        li.appendChild(checkbox);

        if (todo.editing) {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = todo.text;
            editInput.style.backgroundColor = '#3a3a3a';
            editInput.style.color = '#f0f0f0';
            editInput.style.border = '1px solid #555';
            editInput.style.padding = '4px';
            editInput.style.borderRadius = '4px';
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    dispatch(MSG.SAVE_TODO, { id: todo.id, text: editInput.value });
                }
            });
            li.appendChild(editInput);

            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            saveButton.addEventListener('click', () =>
                dispatch(MSG.SAVE_TODO, { id: todo.id, text: editInput.value })
            );
            li.appendChild(saveButton);

            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.addEventListener('click', () => dispatch(MSG.EDIT_TODO, todo.id));
            li.appendChild(cancelButton);

        } else {
            const p = document.createElement('p');
            p.innerText = todo.text;
            li.appendChild(p);

            const editButton = document.createElement('button');
            editButton.innerText = '✏️';
            editButton.addEventListener('click', () => dispatch(MSG.EDIT_TODO, todo.id));
            li.appendChild(editButton);
        }

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => dispatch(MSG.DELETE_TODO, todo.id));
        li.appendChild(deleteButton);

        ul.appendChild(li);
    });

    container.appendChild(ul);

    const deleteCompletedButton = document.createElement('button');
    deleteCompletedButton.innerText = 'Delete Completed';
    deleteCompletedButton.addEventListener('click', () => dispatch(MSG.DELETE_COMPLETED));
    container.appendChild(deleteCompletedButton);

    return container;
}

function mount(rootId, init, update, view) {
    let model = init();
    const root = document.getElementById(rootId);

    async function dispatch(msg, payload) {
        // Update local model first
        model = update(msg, model, payload);
        root.innerHTML = '';
        root.appendChild(view(model, dispatch));

        // Sync with backend
        try {
            switch (msg) {
                case MSG.ADD_TODO:
                    const addRes = await fetch('backend.php?action=add', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: payload.text })
                    });
                    const addData = await addRes.json();
                    // Update id for the newly added todo
                    model.todos = model.todos.map(todo =>
                        todo.new ? { ...todo, id: addData.id, new: false } : todo
                    );
                    break;

                case MSG.TOGGLE_TODO:
                case MSG.DELETE_TODO:
                case MSG.SAVE_TODO:
                    let action = '';
                    let body = {};
                    if (msg === MSG.TOGGLE_TODO) {
                        action = 'toggle';
                        body = { id: payload };
                    } else if (msg === MSG.DELETE_TODO) {
                        action = 'delete';
                        body = { id: payload };
                    } else if (msg === MSG.SAVE_TODO) {
                        action = 'save';
                        body = { id: payload.id, text: payload.text };
                    }
                    await fetch(`backend.php?action=${action}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    break;

                case MSG.DELETE_COMPLETED:
                    await fetch('backend.php?action=delete_completed', { method: 'POST' });
                    break;
            }
        } catch (err) {
            console.error("Backend sync failed:", err);
        }
    }

    // Initial load from backend
    fetch('backend.php?action=get')
        .then(res => res.json())
        .then(data => {
            model.todos = data.map(todo => ({
                id: todo.id,
                text: todo.text,
                completed: todo.completed == 1,
                editing: false,
                new: false
            }));
            root.innerHTML = '';
            root.appendChild(view(model, dispatch));
        });

    root.innerHTML = '';
    root.appendChild(view(model, dispatch));
}

mount('app', init, update, view);
