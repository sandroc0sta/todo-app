function mount(rootId, init, update, view) {
  let model = init();
  const root = document.getElementById(rootId);

  function render() {
    root.innerHTML = '';
    root.appendChild(view(model, dispatch));
  }

async function dispatch(msg, payload) {
    // Update local model first
    model = update(msg, model, payload);
    render();

    // Sync with backend
    try {
      switch(msg) {
        case MSG.ADD_TODO:
          await fetch('backend.php?action=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: payload })
          });
          break;

        case MSG.TOGGLE_TODO:
          await fetch('backend.php?action=toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: payload })
          });
          break;

        case MSG.DELETE_TODO:
          await fetch('backend.php?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: payload })
          });
          break;

        case MSG.DELETE_COMPLETED:
          await fetch('backend.php?action=delete_completed', { method: 'POST' });
          break;

        case MSG.SAVE_TODO:
          await fetch('backend.php?action=save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: payload.index, text: payload.text })
          });
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
        editing: false
      }));
      render();
    });

  render();
}
