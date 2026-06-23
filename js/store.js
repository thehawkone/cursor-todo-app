import { loadTasks, saveTasks } from './model.js';

let tasks = [];

function initStore() {
    tasks = loadTasks();
    return tasks;
}

function addTask(text) {
    tasks.push({ id: crypto.randomUUID().slice(0, 8), text, done: false });
    saveTasks(tasks)
    return tasks;
}

function getTasks() {
    return tasks;
}

function toggleTask(id) {
    const taskId = tasks.findIndex(task => task.id === id);
    if (taskId !== -1) {
        tasks[taskId].done = !tasks[taskId].done;
    }
    else {
        console.error("Задача не найдена");
        return null;
    }
    saveTasks(tasks)
    return tasks[taskId];
}

function deleteTask(id) {
    const userAgreed = confirm('Вы уверены, что хотите удалить задачу?');
    if (userAgreed) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks)
        return tasks;
    }
    else {
        return null;
    }
}

function editTask(id, text) {
    const taskId = tasks.findIndex(task => task.id === id);
    if (taskId !== -1 && text.trim() !== '') {
        const trimmed = text.trim();
        tasks[taskId].text = trimmed;
    }
    else {
        console.error("Задача не найдена");
        return null;
    }
    saveTasks(tasks)
    return tasks[taskId];
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.done);
    saveTasks(tasks)
    return tasks;
}

export { initStore, addTask, getTasks, toggleTask, deleteTask, editTask, clearCompleted };