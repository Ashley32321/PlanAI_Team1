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

            // Display the tasks or show a message if no tasks exist
            taskList.innerHTML = tasks.length > 0
                ? tasks.map(task => `
                    <li data-task-num="${task.task_num}">
                        ${task.task_name} - ${task.task_date} @ ${task.task_time}
                        <button class="delete-btn" onclick="deleteTask('${task.task_num}')">Delete</button>
                        <button class="edit-btn" onclick="editTask('${task.task_num}', '${task.task_name}', '${task.task_date}', '${task.task_time}')">Edit</button>
                        <button class="complete-btn" onclick="markAsCompleted('${task.task_num}')">Complete</button>
                    </li>
                `).join("")
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
    // Get elements after the DOM is loaded
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-name");  // Ensure this matches the actual ID in HTML
    const taskDate = document.getElementById("task-date");    // Ensure this matches the actual ID in HTML
    const taskTime = document.getElementById("task-time");    // Ensure this matches the actual ID in HTML
    const taskList = document.getElementById("task-list");

    // Check if required elements are found in the DOM
    if (!taskInput || !taskDate || !taskTime || !taskForm) {
        console.error("One or more required elements not found in the DOM.");
        return; // Exit early if required elements are missing
    }

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
            loadTasks();  // Refresh task list after submission
            taskForm.reset();  // Reset the form fields
            isEditMode = false;
            currentTaskNum = null;  // Reset edit state
        })
        .catch(error => console.error("Error submitting task:", error));
    });

    // Edit Task
    window.editTask = function (taskNum, name, date, time) {
        console.log("Editing task:", taskNum, name, date, time); // Log for debugging

        // Check if elements exist before assigning values
        if (taskInput && taskDate && taskTime) {
            taskInput.value = name;
            taskDate.value = date;
            taskTime.value = time;
            isEditMode = true;
            currentTaskNum = taskNum;
        } else {
            console.error("One or more input elements are missing.");
        }
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

// Load Tasks
window.loadTasks = function () {
    fetch("fetch_tasks.php")
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = "";  // Clear the task list

            tasks.forEach(task => {
                const taskItem = document.createElement("li");
                taskItem.dataset.taskNum = task.task_num;
                taskItem.classList.add("task-item");

                // Check the task status and mark as "completed" if necessary
                if (task.status === "Completed") {
                    taskItem.classList.add("completed");
                }

                const taskContent = document.createElement("span");
                taskContent.textContent = `${task.task_name} - ${task.task_date} ${task.task_time}`;
                taskItem.appendChild(taskContent);

                const actionsDiv = document.createElement("div");
                actionsDiv.classList.add("task-actions");

                // Create "Complete" Button
                const completeButton = document.createElement("button");
                completeButton.classList.add("complete-btn");
                completeButton.textContent = task.status === "Completed" ? "Uncomplete" : "Complete";
                completeButton.addEventListener("click", () => markAsCompleted(task.task_num, taskItem));
                actionsDiv.appendChild(completeButton);

                // Create "Edit" Button
                const editButton = document.createElement("button");
                editButton.classList.add("edit-btn");
                editButton.textContent = "Edit";
                editButton.addEventListener("click", () => editTask(task.task_num, task.task_name, task.task_date, task.task_time));
                actionsDiv.appendChild(editButton);

                // Create "Delete" Button
                const deleteButton = document.createElement("button");
                deleteButton.classList.add("delete-btn");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", () => deleteTask(task.task_num, taskItem));
                actionsDiv.appendChild(deleteButton);

                taskItem.appendChild(actionsDiv);
                taskList.appendChild(taskItem);
            });
        })
        .catch(error => console.error("Error loading tasks:", error));
};



// Initial task loading
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
