const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoStats = document.getElementById('todo-stats');

function updateStats() {
    todoStats.textContent = `Текущие задачи: ${todoList.children.length}`;
}

todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText) {
        const todoItem = document.createElement('li');
        const span = document.createElement('span');
        const button = document.createElement('button');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.addEventListener('change', (event) => {
            if (event.target.checked) {
                event.target.parentElement.classList.add('todo-list__item--done');
            } else {
                event.target.parentElement.classList.remove('todo-list__item--done');
            }
        });
        input.classList.add('todo-list__item-input');
        todoItem.appendChild(input);
        todoItem.appendChild(span);
        todoItem.appendChild(button);

        span.textContent = todoText;
        button.textContent = 'Удалить';
        button.classList.add('todo-list__delete');
        button.addEventListener('click', (event) => {
            event.target.parentElement.remove();
            updateStats();
        });
        todoList.appendChild(todoItem);
        updateStats();
    } else if (todoText === '') {
        alert('Введите задачу, чтобы добавить её в список');
    }

    todoInput.value = '';
});

todoList.addEventListener('click', (event) => {

});