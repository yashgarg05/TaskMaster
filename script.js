const tasks = [];

const taskInput = document.getElementById("task-input");
const taskInputForm = document.getElementById("task-input-form");
const addTaskButton = document.getElementById("add-task-btn");

const searchInput = document.getElementById("search-input");
const taskList = document.getElementById("task-list");

const allFilter = document.getElementById("all-filter");
const activeFilter = document.getElementById("active-filter");
const completedFilter = document.getElementById("completed-filter");

const totalCount = document.getElementById("total-count");
const activeCount = document.getElementById("active-count");
const completedCount = document.getElementById("completed-count");

let currentFilter = "all";


// =========================
// Add Task
// =========================

taskInputForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        taskInput.focus();
        return;
    }

    addTask(taskText);

    taskInput.value = "";
    taskInput.focus();
});


// =========================
// Top Add Task Button
// =========================

addTaskButton.addEventListener("click", () => {
    taskInput.focus();

    taskInputForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});


// =========================
// Event Delegation
// =========================

taskList.addEventListener("click", (event) => {

    const clickedElement = event.target;

    if (clickedElement.classList.contains("delete-btn")) {
        deleteTask(clickedElement);
    }

    else if (clickedElement.classList.contains("edit-btn")) {

        if (clickedElement.textContent === "Edit") {
            startEditingTask(clickedElement);
        }

        else {
            saveEditedTask(clickedElement);
        }
    }

    else if (clickedElement.classList.contains("task-checkbox")) {
        toggleTaskCompletion(clickedElement);
    }
});


// =========================
// Search
// =========================

searchInput.addEventListener("input", () => {
    renderTasks();
});


// =========================
// Keyboard Shortcut
// Cmd/Ctrl + K
// =========================

document.addEventListener("keydown", (event) => {

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {

        event.preventDefault();

        searchInput.focus();
    }
});


// =========================
// Filters
// =========================

allFilter.addEventListener("click", () => {
    setFilter("all");
});

activeFilter.addEventListener("click", () => {
    setFilter("active");
});

completedFilter.addEventListener("click", () => {
    setFilter("completed");
});


// =========================
// Set Filter
// =========================

function setFilter(filter) {

    currentFilter = filter;

    updateFilterButtons();
    renderTasks();
}


// =========================
// Update Filter Buttons
// =========================

function updateFilterButtons() {

    allFilter.classList.remove("active");
    activeFilter.classList.remove("active");
    completedFilter.classList.remove("active");


    if (currentFilter === "all") {
        allFilter.classList.add("active");
    }

    else if (currentFilter === "active") {
        activeFilter.classList.add("active");
    }

    else if (currentFilter === "completed") {
        completedFilter.classList.add("active");
    }
}


// =========================
// Add Task
// =========================

function addTask(taskText) {

    const task = {
        id: Date.now(),
        title: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();
}


// =========================
// Delete Task
// =========================

function deleteTask(deleteButton) {

    const taskItem = deleteButton.closest("li");

    const taskId = Number(taskItem.dataset.id);

    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return;
    }

    tasks.splice(taskIndex, 1);

    saveTasks();
    renderTasks();
}


// =========================
// Toggle Completion
// =========================

function toggleTaskCompletion(checkbox) {

    const taskItem = checkbox.closest("li");

    const taskId = Number(taskItem.dataset.id);

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    task.completed = checkbox.checked;

    saveTasks();
    renderTasks();
}


// =========================
// Start Editing
// =========================

function startEditingTask(editButton) {

    const taskItem = editButton.closest("li");

    const taskText = taskItem.querySelector(".task-text");

    if (!taskText) {
        return;
    }

    const editInput = document.createElement("input");

    editInput.type = "text";
    editInput.classList.add("edit-input");

    editInput.value = taskText.textContent;

    editInput.dataset.originalText = taskText.textContent;

    taskText.replaceWith(editInput);

    editButton.textContent = "Save";

    editInput.focus();
    editInput.select();


    editInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {
            event.preventDefault();

            saveEditedTask(editButton);
        }

        else if (event.key === "Escape") {
            event.preventDefault();

            cancelEditingTask(editInput);
        }
    });
}


// =========================
// Save Edited Task
// =========================

function saveEditedTask(saveButton) {

    const taskItem = saveButton.closest("li");

    const taskId = Number(taskItem.dataset.id);

    const editInput = taskItem.querySelector(".edit-input");

    if (!editInput) {
        return;
    }

    const newText = editInput.value.trim();

    if (newText === "") {
        editInput.focus();
        return;
    }

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    task.title = newText;

    saveTasks();
    renderTasks();
}


// =========================
// Cancel Editing
// =========================

function cancelEditingTask(editInput) {

    const taskItem = editInput.closest("li");

    const editButton = taskItem.querySelector(".edit-btn");

    const taskText = document.createElement("span");

    taskText.classList.add("task-text");

    taskText.textContent = editInput.dataset.originalText;

    editInput.replaceWith(taskText);

    editButton.textContent = "Edit";
}


// =========================
// Create Task Element
// =========================

function createTaskElement(task) {

    const listItem = document.createElement("li");

    listItem.dataset.id = task.id;

    if (task.completed) {
        listItem.classList.add("completed");
    }


    // Checkbox

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");

    checkbox.checked = task.completed;

    checkbox.setAttribute(
        "aria-label",
        `Mark "${task.title}" as ${task.completed ? "active" : "completed"}`
    );


    // Task Content

    const taskText = document.createElement("span");

    taskText.classList.add("task-text");

    taskText.textContent = task.title;


    // Actions Container

    const actions = document.createElement("div");

    actions.classList.add("task-actions");


    // Edit Button

    const editButton = document.createElement("button");

    editButton.type = "button";
    editButton.classList.add("edit-btn");

    editButton.textContent = "Edit";


    // Delete Button

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.classList.add("delete-btn");

    deleteButton.textContent = "Delete";


    actions.appendChild(editButton);
    actions.appendChild(deleteButton);


    // Assemble Task

    listItem.appendChild(checkbox);
    listItem.appendChild(taskText);
    listItem.appendChild(actions);


    return listItem;
}


// =========================
// Render Tasks
// =========================

function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.trim().toLowerCase();


    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);


        let matchesFilter = true;


        if (currentFilter === "active") {
            matchesFilter = !task.completed;
        }

        else if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }


        return matchesSearch && matchesFilter;
    });


    if (filteredTasks.length === 0) {

        const emptyState = document.createElement("li");

        emptyState.classList.add("empty-state");

        if (searchText !== "") {
            emptyState.innerHTML = `
                <div class="empty-icon">⌕</div>
                <strong>No tasks found</strong>
                <p>Try searching for something else.</p>
            `;
        }

        else if (currentFilter === "completed") {
            emptyState.innerHTML = `
                <div class="empty-icon">✓</div>
                <strong>No completed tasks</strong>
                <p>Completed tasks will appear here.</p>
            `;
        }

        else if (currentFilter === "active") {
            emptyState.innerHTML = `
                <div class="empty-icon">○</div>
                <strong>No active tasks</strong>
                <p>You're all caught up.</p>
            `;
        }

        else {
            emptyState.innerHTML = `
                <div class="empty-icon">+</div>
                <strong>No tasks yet</strong>
                <p>Add your first task to get started.</p>
            `;
        }

        taskList.appendChild(emptyState);
    }

    else {

        filteredTasks.forEach(task => {

            const taskElement = createTaskElement(task);

            taskList.appendChild(taskElement);
        });
    }


    updateTaskStats();
}


// =========================
// Update Statistics
// =========================

function updateTaskStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const active = total - completed;


    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}


// =========================
// Save Tasks
// =========================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// =========================
// Load Tasks
// =========================

function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
        return;
    }

    try {

        const storedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(storedTasks)) {
            return;
        }

        tasks.push(...storedTasks);

    }

    catch (error) {

        console.error(
            "Could not load tasks:",
            error
        );
    }
}


// =========================
// Start Application
// =========================

loadTasks();

updateFilterButtons();
renderTasks();