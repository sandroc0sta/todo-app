function mount(rootId, init, update, view) {
  let model = init();
  const root = document.getElementById(rootId);

  function render() {
    root.innerHTML = '';
    root.appendChild(view(model, dispatch));
  }

  function dispatch(msg, payload) {
    model = update(msg, model, payload);
    render();
  }

  render();
}
