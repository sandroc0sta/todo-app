const MSG = {
    ADD_TODO: 'ADD_TODO',
    TOGGLE_TODO: 'TOGGLE_TODO',
    DELETE_TODO: 'DELETE_TODO',
    DELETE_COMPLETED: 'DELETE_COMPLETED',
    EDIT_TODO: 'EDIT_TODO'
};

function init() {
    return {
        todos: []
    };
}

function update(msg, model, payload) {
    switch (msg) {
        case MSG.ADD_TODO:
            if (!payload || payload.trim() === '') return model; //if empty, ignore

            return {
                ...model,
                todos: [...model.todos, { text: payload, completed: false, editing: false, new: true }]
            };

        case MSG.TOGGLE_TODO:
            if (payload == null) return model;

            return {
                ...model,
                todos: model.todos.map((todo, index) =>
                    index === payload ? { ...todo, completed: !todo.completed } : todo
                )
            };

        case MSG.DELETE_TODO:
            if (payload == null) return model;

            return {
                ...model,
                todos: model.todos.filter((_, index) => index !== payload)
            };

        case MSG.DELETE_COMPLETED:
            return {
                ...model,
                todos: model.todos.filter(todo => !todo.completed)
            }

        case MSG.EDIT_TODO:
            if (payload == null) return model;

            return {
                ...model,
                todos: model.todos.map((todo, index) =>
                    index === payload ? { ...todo, editing: !todo.editing } : todo
                )
            };

        case MSG.SAVE_TODO:
            if (!payload || payload.index == null) return model;

            return {
                ...model,
                todos: model.todos.map((todo, index) =>
                    index === payload.index
                        ? { ...todo, text: payload.text, editing: false }
                        : todo
                )
            };


    }
}

function view(model, dispatch) {
    const input = document.createElement("input");
    input.type = 'text';
    input.id = 'new-todo';
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            dispatch(MSG.ADD_TODO, input.value);
            input.value = '';
        }
    });

    const container = document.createElement('div');

    const title = document.createElement('h3');
    title.innerText = 'My Todos:';
    container.appendChild(title);
    container.appendChild(input);

    const ul = document.createElement('ul');

    // map todos with their original index for reference
    const todosWithIndex = model.todos.map((todo, index) => ({ ...todo, origIndex: index }));
    // sort for display only
    const sortedTodos = todosWithIndex.sort((a, b) => {
    if (a.completed === b.completed) return a.origIndex - b.origIndex; // preserve original order
    return a.completed - b.completed; // incomplete first
});

    sortedTodos.forEach((todo, displayIndex) => {
        const li = document.createElement('li');
        const origIndex = todo.origIndex;

        // checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('click', () => dispatch(MSG.TOGGLE_TODO, origIndex));
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
            editInput.addEventListener('focus', () => {
                editInput.style.boxShadow = '0 0 8px #ff4d4f';
            });
            editInput.addEventListener('blur', () => {
                editInput.style.boxShadow = 'none';
            });
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    dispatch(MSG.SAVE_TODO, { index: origIndex, text: editInput.value });
                }
            });
            li.appendChild(editInput);

            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            if (todo.new) saveButton.classList.add('animated');
            saveButton.addEventListener('click', () =>
                dispatch(MSG.SAVE_TODO, { index: origIndex, text: editInput.value })
            );
            li.appendChild(saveButton);

            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.addEventListener('click', () => dispatch(MSG.EDIT_TODO, origIndex));
            li.appendChild(cancelButton);

        } else {
            const p = document.createElement('p');
            p.innerText = `${displayIndex + 1}. ${todo.text}`;
            li.appendChild(p);

            const editButton = document.createElement('button');
            editButton.id = 'edit-btn';
            editButton.innerText = "✏️";
            editButton.addEventListener('click', () => dispatch(MSG.EDIT_TODO, origIndex));
            li.appendChild(editButton);
        }

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => dispatch(MSG.DELETE_TODO, origIndex));
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





mount('app', init, update, view);

