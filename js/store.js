let tasks = [];

function addTask(text) {
    tasks.push({ id: crypto.randomUUID().slice(0, 8), text, done: false });
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
    return tasks[taskId];
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    return tasks;
}

function editTask(id) {
}

export { addTask, getTasks, toggleTask, deleteTask, editTask };