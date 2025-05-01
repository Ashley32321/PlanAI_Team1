const signInPrompt = 'Please click the button below to log in using your Google account.';
const clientId = '';

window.onload = () => {
    const promptElement = document.getElementById("prompt");
    if (promptElement) {
        promptElement.textContent = signInPrompt;
    }

    if (google?.accounts?.id) {
        google.accounts.id.initialize({
            client_id: clientId,
            callback: afterSignIn
        });
        google.accounts.id.renderButton(
            document.getElementById("signin-button"),
            { theme: "outline", size: "large" }
        );
    }

    loadTasks(); // Always load tasks on page load
};

// === Load tasks from backend and display ===
function loadTasks() {
    const taskList = document.getElementById("task-list");

    fetch("fetch_tasks.php")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Check for HTTP errors
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error("Response is not JSON");
            }
            return response.json();  // Parse the JSON response
        })
        .then(tasks => {
            console.log("Fetched tasks:", tasks);
            if (tasks.error) {
                console.error("Database Error:", tasks.error);
                taskList.innerHTML = "<li>Failed to load tasks.</li>";
                return;
            }

            // Function to convert military time (24-hour format) to 12-hour AM/PM format
            function convertTo12HourFormat(time) {
                let [hours, minutes] = time.split(':');
                hours = parseInt(hours, 10); // Convert hours to number
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // 12 AM/PM case
                minutes = minutes.padStart(2, '0'); // Ensure minutes are 2 digits
                return `${hours}:${minutes} ${ampm}`;
            }

            // Display the tasks or show a message if no tasks exist
            taskList.innerHTML = tasks.length > 0
                ? tasks.map(task => {
                    const formattedTime = convertTo12HourFormat(task.task_time); // Convert the time
                    return `
                        <li data-task-num="${task.task_num}">
                            ${task.task_name} - ${task.task_date} @ ${formattedTime}
                            <button class="delete-btn" onclick="deleteTask('${task.task_num}')">Delete</button>
                            <button class="edit-btn" onclick="editTask('${task.task_num}', '${task.task_name}', '${task.task_date}', '${task.task_time}')">Edit</button>
                            <button class="complete-btn" onclick="markAsCompleted('${task.task_num}')">Complete</button>
                        </li>
                    `;
                }).join("")
                : "<li>No tasks found.</li>";
        })
        .catch(error => {
            console.error("Error loading tasks:", error);

            // Handle specific error messages
            if (error.message === "Response is not JSON") {
                taskList.innerHTML = "<li>Failed to load tasks. Data is not in JSON format.</li>";
            } else if (error.message.startsWith("HTTP error!")) {
                taskList.innerHTML = `<li>Failed to load tasks. HTTP error: ${error.message}</li>`;
            } else {
                taskList.innerHTML = "<li>Failed to load tasks. An unknown error occurred.</li>";
            }
        });
}


// === Sign-In Callback ===
function afterSignIn(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    const name = responsePayload.name;
    const email = responsePayload.email;
    const userInfo = `Welcome, ${name}. Your email is ${email}.`;

    document.getElementById('prompt').textContent = userInfo;
    document.getElementById('signin-button').remove();

    const signOutButton = document.createElement('button');
    signOutButton.setAttribute('id', 'signout-button');
    signOutButton.setAttribute('onclick', 'afterSignOut()');
    signOutButton.textContent = 'Sign Out';
    document.body.appendChild(signOutButton);

    localStorage.setItem('user', JSON.stringify(responsePayload));

    loadTasks();
}

// === Decode Google token ===
function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// === Sign-Out Handler ===
function afterSignOut() {
    document.getElementById('prompt').textContent = signInPrompt;
    document.getElementById('signout-button').remove();

    const signInButton = document.createElement('div');
    signInButton.setAttribute('id', 'signin-button');
    document.body.appendChild(signInButton);
    google.accounts.id.renderButton(
        document.getElementById("signin-button"),
        { theme: "outline", size: "large" }
    );
    google.accounts.id.disableAutoSelect();

    localStorage.removeItem('user');

    const taskList = document.getElementById("task-list");
    if (taskList) taskList.innerHTML = "";
}

// === DOM Ready Setup ===
document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-name");
    const taskDate = document.getElementById("task-date");
    const taskTime = document.getElementById("task-time");
    const taskList = document.getElementById("task-list");
    const searchBar = document.getElementById("search-bar");
    const filterDateInput = document.getElementById("filter-date");
    const filterTypeSelect = document.getElementById("filter-type");

    let allTasks = []; // Store tasks globally

    // Prevent past dates
    function setMinDateTime() {
        const now = new Date();
        const minDate = now.toISOString().split("T")[0];
        taskDate.min = minDate;

        function updateMinTime() {
            const selectedDate = taskDate.value;
            const today = new Date().toISOString().split("T")[0];
            if (selectedDate === today) {
                const minTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
                taskTime.min = minTime;
            } else {
                taskTime.removeAttribute("min");
            }
        }

        taskDate.addEventListener("change", updateMinTime);
        updateMinTime();
    }
    setMinDateTime();

    // Edit mode state
    let isEditMode = false;
    let currentTaskNum = null;

    // Submit handler (add or edit task)
    if (taskForm) {
        taskForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const formData = new FormData(taskForm);
            const url = isEditMode ? "edit_task.php" : "add_task.php";

            if (isEditMode) formData.append("task_num", currentTaskNum);

            fetch(url, {
                method: "POST",
                body: formData
            })
                .then(() => {
                    loadTasks();
                    taskForm.reset();
                    isEditMode = false;
                    currentTaskNum = null;
                })
                .catch(error => console.error("Error submitting task:", error));
        });
    }

    // Edit Task
    window.editTask = function (taskNum, name, date, time) {
        taskInput.value = name;
        taskDate.value = date;
        taskTime.value = time;
        isEditMode = true;
        currentTaskNum = taskNum;
    };

    // Toggle Completed/Uncompleted
    window.markAsCompleted = function (taskNum, taskElement) {
        const isCompleted = taskElement.classList.contains("completed");
        const newStatus = isCompleted ? "Not Completed" : "Completed";

        fetch(`mark_completed.php?task_num=${taskNum}&status=${newStatus}`)
            .then(() => {
                taskElement.classList.toggle("completed");
                const btn = taskElement.querySelector(".complete-btn");
                btn.textContent = isCompleted ? "Complete" : "Uncomplete";
            })
            .catch(error => console.error("Error toggling task status:", error));
    };

    // Delete Task
    window.deleteTask = function (taskNum, taskElement) {
        fetch(`delete_task.php?task_num=${taskNum}`)
            .then(() => {
                taskElement.remove();
                loadTasks();
            })
            .catch(error => console.error("Error deleting task:", error));
    };

    // Render Tasks (filtered or all)
    function renderTasks(tasks) {
        taskList.innerHTML = "";
    
        // Convert military time (24-hour) to 12-hour AM/PM
        function convertTo12HourFormat(time) {
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours, 10);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours}:${minutes.padStart(2, '0')} ${ampm}`;
        }
    
        tasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.dataset.taskNum = task.task_num;
            taskItem.classList.add("task-item");
            if (task.status === "Completed") taskItem.classList.add("completed");
    
            const taskContent = document.createElement("span");
            const formattedTime = convertTo12HourFormat(task.task_time);
            taskContent.textContent = `${task.task_name} - ${task.task_date} @ ${formattedTime}`;
            taskItem.appendChild(taskContent); // ✅ FIX: Add this line


            const actionsDiv = document.createElement("div");
            actionsDiv.classList.add("task-actions");

            const completeButton = document.createElement("button");
            completeButton.classList.add("complete-btn");
            completeButton.textContent = task.status === "Completed" ? "Uncomplete" : "Complete";
            completeButton.addEventListener("click", () => markAsCompleted(task.task_num, taskItem));
            actionsDiv.appendChild(completeButton);

            const editButton = document.createElement("button");
            editButton.classList.add("edit-btn");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => editTask(task.task_num, task.task_name, task.task_date, task.task_time));
            actionsDiv.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-btn");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteTask(task.task_num, taskItem));
            actionsDiv.appendChild(deleteButton);

            taskItem.appendChild(actionsDiv);
            taskList.appendChild(taskItem);
        });
    }

    // Load Tasks
    window.loadTasks = function () {
        fetch("fetch_tasks.php")
            .then(response => response.json())
            .then(tasks => {
                allTasks = tasks; // Save all tasks globally
                renderTasks(allTasks);
            })
            .catch(error => console.error("Error loading tasks:", error));
    };

    // Search Tasks
    if (searchBar) {
        searchBar.addEventListener("input", function () {
            const query = searchBar.value.toLowerCase();
            const filteredTasks = allTasks.filter(task =>
                task.task_name.toLowerCase().includes(query)
            );
            renderTasks(filteredTasks);
        });
    }

    // Filter Tasks by Date
    if (filterDateInput && filterTypeSelect) {
        filterDateInput.addEventListener("change", function () {
            const filterDate = filterDateInput.value;
            const filterType = filterTypeSelect.value;
            let filteredTasks = allTasks;

            if (filterDate) {
                filteredTasks = filteredTasks.filter(task => {
                    const taskDate = new Date(task.task_date);
                    const selectedDate = new Date(filterDate);

                    if (filterType === "before") {
                        return taskDate < selectedDate;
                    } else if (filterType === "after") {
                        return taskDate > selectedDate;
                    }
                    return true;
                });
            }

            renderTasks(filteredTasks);
        });

        filterTypeSelect.addEventListener("change", function () {
            const filterDate = filterDateInput.value;
            const filterType = filterTypeSelect.value;
            let filteredTasks = allTasks;

            if (filterDate) {
                filteredTasks = filteredTasks.filter(task => {
                    const taskDate = new Date(task.task_date);
                    const selectedDate = new Date(filterDate);

                    if (filterType === "before") {
                        return taskDate < selectedDate;
                    } else if (filterType === "after") {
                        return taskDate > selectedDate;
                    }
                    return true;
                });
            }

            renderTasks(filteredTasks);
        });
    }

    // Initial load
    loadTasks();

    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "light") {
        document.body.classList.add("light-theme");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("light-theme");
            localStorage.setItem("theme",
                document.body.classList.contains("light-theme") ? "light" : "dark"
            );
        });
    }
});

