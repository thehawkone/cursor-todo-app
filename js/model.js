function loadTasks() {
    const tasks = localStorage.getItem('todo-tasks');
    if (tasks === null || tasks === '') {
        return [];
    }
    try {
        const data = JSON.parse(tasks);
        return Array.isArray(data) ? data : [];
    }
    catch (error) {
        console.error('Ошибка при загрузке задач:', error);
        return [];
    }
}

function saveTasks(tasks) {
    try {
        localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    }
    catch (error) {
        console.error('Ошибка при сохранении задач:', error);
    }
}

export { loadTasks, saveTasks };