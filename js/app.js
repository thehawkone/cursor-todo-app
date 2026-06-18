import { addTask, deleteTask, toggleTask, getTasks, editTask } from './store.js';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoStats = document.getElementById('todo-stats');

function updateStats() {
    todoStats.textContent = `Текущие задачи: ${todoList.children.length}`;
}

function renderTasks() {
    todoList.innerHTML = '';
    const tasks = getTasks();
    for (const task of tasks) {
        const todoItem = document.createElement('li');
        const span = document.createElement('span');
        const button = document.createElement('button');
        const input = document.createElement('input');
        input.type = 'checkbox';

        if (task.done === true) {
            input.checked = true;
            todoItem.classList.add('todo-list__item--done');
        }

        input.addEventListener('change', (event) => {
            toggleTask(task.id);
            renderTasks();
        });
        input.classList.add('todo-list__item-input');
        todoItem.appendChild(input);
        todoItem.appendChild(span);
        todoItem.appendChild(button);

        span.textContent = task.text;
        button.textContent = 'Удалить';
        button.type = 'button'
        button.classList.add('todo-list__delete');
        button.addEventListener('click', (event) => {
            deleteTask(task.id);
            renderTasks();
        });
        todoList.appendChild(todoItem);
    }
    updateStats();
}

todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (todoInput.value.trim() === '') {
        alert('Введите задачу, чтобы добавить её в список');
    }
    else {
        addTask(todoInput.value.trim());
        renderTasks();
        todoInput.value = '';
    }
});

renderTasks();