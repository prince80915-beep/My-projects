let tasks = [];

const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");

const searchInput = document.getElementById("searchInput");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let currentFilter = "all";


// ===============================
// ADD TASK
// ===============================

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task!");

        return;
    }


    const task = {

        id: Date.now(),

        text: text,

        priority: priority.value,

        dueDate: dueDate.value,

        completed: false

    };


    tasks.push(task);


    taskInput.value = "";

    dueDate.value = "";


    saveTasks();

    displayTasks();

}


// ===============================
// DISPLAY TASKS
// ===============================

function displayTasks() {

    taskList.innerHTML = "";


    let filteredTasks = tasks;


    // FILTER
    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );

    }


    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );

    }


    // SEARCH
    const searchText = searchInput.value
        .toLowerCase()
        .trim();


    if (searchText !== "") {

        filteredTasks = filteredTasks.filter(task =>
            task.text.toLowerCase().includes(searchText)
        );

    }


    // SHOW TASKS
    filteredTasks.forEach(task => {

        const li = document.createElement("li");


        li.className = "task-item";


        if (task.completed) {

            li.classList.add("completed");

        }


        li.innerHTML = `

            <span class="task-text">
                ${task.text}
            </span>


            <span class="priority ${task.priority}">
                ${task.priority.toUpperCase()}
            </span>


            <small>
                ${
                    task.dueDate
                    ? "Due: " + task.dueDate
                    : "No date"
                }
            </small>


            <button
                class="complete-btn"
                onclick="completeTask(${task.id})">

                ${
                    task.completed
                    ? "Undo"
                    : "Done"
                }

            </button>


            <button
                class="edit-btn"
                onclick="editTask(${task.id})">

                Edit

            </button>


            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})">

                Delete

            </button>

        `;


        taskList.appendChild(li);

    });


    updateCounter();

}


// ===============================
// COMPLETE / UNDO
// ===============================

function completeTask(id) {

    const task = tasks.find(
        task => task.id === id
    );


    if (task) {

        task.completed = !task.completed;

    }


    saveTasks();

    displayTasks();

}


// ===============================
// EDIT TASK
// ===============================

function editTask(id) {

    const task = tasks.find(
        task => task.id === id
    );


    if (!task) {

        return;

    }


    const newText = prompt(
        "Edit your task:",
        task.text
    );


    if (
        newText !== null &&
        newText.trim() !== ""
    ) {

        task.text = newText.trim();


        saveTasks();

        displayTasks();

    }

}


// ===============================
// DELETE TASK
// ===============================

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    displayTasks();

}


// ===============================
// FILTER
// ===============================

const filterButtons =
    document.querySelectorAll(".filter");


filterButtons.forEach(button => {

    button.addEventListener("click", function() {


        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        this.classList.add("active");


        currentFilter =
            this.dataset.filter;


        displayTasks();

    });

});


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    function() {

        displayTasks();

    }
);


// ===============================
// COUNTER
// ===============================

function updateCounter() {

    const total = tasks.length;


    const completed = tasks.filter(
        task => task.completed
    ).length;


    const pending =
        total - completed;


    totalTasks.textContent =
        total;


    completedTasks.textContent =
        completed;


    pendingTasks.textContent =
        pending;

}


// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ===============================
// LOAD TASKS
// ===============================

function loadTasks() {

    const savedTasks =
        localStorage.getItem("tasks");


    if (savedTasks) {

        tasks = JSON.parse(savedTasks);


        // पुराने tasks को default values देना

        tasks = tasks.map(task => ({

            ...task,

            priority:
                task.priority || "medium",

            dueDate:
                task.dueDate || ""

        }));


        saveTasks();

    }


    displayTasks();

}


// ===============================
// START APP
// ===============================

loadTasks();