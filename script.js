const taskInput = document.getElementById("task-input");
const ul = document.querySelector("#task-list");

document.querySelector("#task-input-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        return;
    }
    addTask(taskText);

    taskInput.value = "";
    taskInput.focus();
});

ul.addEventListener("click", (event) => {
    const clickedItem = event.target;

    if (clickedItem.classList.contains("delete-btn")) {
        deleteTask(clickedItem);
    }

    else if (clickedItem.classList.contains("task-checkbox")) {
        toggleTaskCompletion(clickedItem);
    }

    else if (clickedItem.classList.contains("edit-btn")) {

        if (clickedItem.textContent === "Edit") {
            startEditingTask(clickedItem);
        } else {
            saveEditedTask(clickedItem);
        }

    }
});

function addTask(taskText) {
    const taskElement = createTaskElement(taskText);
    ul.appendChild(taskElement);
}

function createTaskElement(taskText) {
    const listElement = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");

    const span = document.createElement("span");
    span.classList.add("task-text");
    span.textContent = taskText;

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";

    listElement.appendChild(checkbox);
    listElement.appendChild(span);
    listElement.appendChild(editBtn);
    listElement.appendChild(deleteBtn);

    return listElement;
}

function deleteTask(deleteBtn) {
    deleteBtn.parentElement.remove();
}

function toggleTaskCompletion(checkbox) {
    if (checkbox.checked) {
        checkbox.parentElement.classList.add("completed");
    } else {
        checkbox.parentElement.classList.remove("completed");
    }
}

function startEditingTask(editBtn) {

    editBtn.textContent = "Save";

    const taskItem = editBtn.parentElement;
    const taskTextSpan = taskItem.querySelector(".task-text");

    const editInput = document.createElement("input");
    editInput.classList.add("edit-input");
    editInput.dataset.originalText = taskTextSpan.textContent;
    editInput.value = taskTextSpan.textContent;

    taskTextSpan.replaceWith(editInput);

    editInput.focus();
    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            cancelEditingTask(editInput);
        }
    });
}

function saveEditedTask(saveBtn) {
    const taskItem = saveBtn.parentElement;
    const editInput = taskItem.querySelector(".edit-input");
    const taskText = editInput.value.trim();

    if (taskText === "") {
        editInput.focus();
        return;
    }
    const span = document.createElement("span");
    span.classList.add("task-text");
    span.textContent = taskText;
    editInput.replaceWith(span);
    saveBtn.textContent = "Edit";
}

function cancelEditingTask(editInput) {
    const taskItem = editInput.parentElement;
    const editBtn = taskItem.querySelector(".edit-btn");

    const span = document.createElement("span");
    span.classList.add("task-text");
    span.textContent = editInput.dataset.originalText;

    editInput.replaceWith(span);

    editBtn.textContent = "Edit";
}