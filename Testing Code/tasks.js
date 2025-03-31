const signInPrompt = 'Please click the button below to log in using your Google account.';
const clientId = '';

window.onload = () => {
    document.getElementById("prompt").textContent = signInPrompt;

    google.accounts.id.initialize({
        client_id: clientId,
        callback: afterSignIn
    });
    google.accounts.id.renderButton(
        document.getElementById("signin-button"),
        { theme: "outline", size: "large" }
    );
};

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
    const signOutText = document.createTextNode('Sign Out');
    signOutButton.appendChild(signOutText);
    document.body.appendChild(signOutButton);

    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(responsePayload));

    // Load tasks for the signed-in user
    loadTasks();
}

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

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

    // Clear user data from localStorage
    localStorage.removeItem('user');
    
    // Clear the task list
    taskList.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    // Apply stored theme
    if (currentTheme === "light") {
        document.body.classList.add("light-theme");
    }

    // Toggle Theme
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("light-theme");

        // Store theme preference
        if (document.body.classList.contains("light-theme")) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-name");
    const taskDate = document.getElementById("task-date");
    const taskTime = document.getElementById("task-time");
    const taskList = document.getElementById("task-list");

    //  Prevent past date & time selection
    function setMinDateTime() {
        const now = new Date();
        const minDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format
        taskDate.min = minDate;

        function updateMinTime() {
            const selectedDate = taskDate.value;
            const today = new Date().toISOString().split("T")[0];

            if (selectedDate === today) {
                const minTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
                taskTime.min = minTime;
            } else {
                taskTime.removeAttribute("min"); // Allow any time for future dates
            }
        }

        taskDate.addEventListener("change", updateMinTime);
        updateMinTime();
    }
    setMinDateTime(); // Call on page load

    //  Load tasks from database
    function loadTasks() {
        fetch("fetch_tasks.php")
            .then(response => response.json())
            .then(tasks => {
                if (tasks.error) {
                    console.error("Database Error:", tasks.error);
                    return;
                }
                taskList.innerHTML = tasks.length > 0
                    ? tasks.map(task => `<li>${task.task_name} - ${task.task_date} @ ${task.task_time}</li>`).join("")
                    : "<li>No tasks found.</li>";
            })
            .catch(error => console.error("Error loading tasks:", error));
    }    

    //  Display tasks in list
    function addTaskToDOM(task) {
        const li = document.createElement("li");
        li.dataset.taskNum = task.task_num;

        let [hours, minutes] = task.task_time.split(":");
        let ampm = hours >= 12 ? "PM" : "AM";
        let formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;

        li.innerHTML = `
            <span class="task-text">${task.task_name} - ${task.task_date} @ ${formattedTime}</span>
            <div class="task-actions">
                <button class="delete-btn">✖ Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    }

    //  Handle task submission
    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(taskForm);

        fetch("add_task.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(() => {
            loadTasks(); // Reload tasks
            taskForm.reset();
        })
        .catch(error => console.error("Error adding task:", error));
    });

    //  Delete task from database & remove from UI
    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-btn")) {
            const taskNum = e.target.closest("li").dataset.taskNum;
            fetch(`delete_task.php?task_num=${taskNum}`)
                .then(() => loadTasks())
                .catch(error => console.error("Error deleting task:", error));
        }
    });

    loadTasks(); // Load tasks on page load
});
