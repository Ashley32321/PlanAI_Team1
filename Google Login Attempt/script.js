document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const searchBar = document.getElementById("search-bar");
    const daySelect = document.getElementById("day-select");
    const taskTime = document.getElementById("task-time");
    const signInPrompt = "Please click the button below to log in using your Google account.";
    const clientId = "998946007648-orlcfpteudvhiajo6bnv0jhvqmkbgt9t.apps.googleusercontent.com";

    initializeDropdown();
    loadTasks();

    // Initialize Google Login
    document.getElementById("prompt").textContent = signInPrompt;

    google.accounts.id.initialize({
        client_id: clientId,
        callback: afterSignIn
    });
    google.accounts.id.renderButton(
        document.getElementById("signin-button"),
        { theme: "outline", size: "large" }
    );

    // Generate dropdown with correct date order
    function initializeDropdown() {
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            let futureDate = new Date();
            futureDate.setDate(today.getDate() + i);
            let dayName = futureDate.toLocaleDateString("en-US", { weekday: "long" });
            let formattedDate = futureDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            let option = document.createElement("option");
            option.value = futureDate.toISOString().split("T")[0];
            option.textContent = `${dayName} (${formattedDate})`;
            daySelect.appendChild(option);
        }
    }

    // Add task event listener
    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        addTask(taskInput.value, daySelect.value, taskTime.value);
        taskInput.value = "";
        taskTime.value = "";
    });

    function addTask(taskText, day, time) {
        const li = document.createElement("li");
        li.setAttribute("data-date", day);
        li.setAttribute("data-time", time);

        li.innerHTML = `
            <span class="task-text">${taskText} - ${day} @ ${time}</span>
            <div class="task-actions">
                <button class="edit-btn">✎ Edit</button>
                <button class="complete-btn">✔ Complete</button>
                <button class="delete-btn">✖ Delete</button>
            </div>
        `;
        taskList.appendChild(li);
        sortTasks();
        saveTasks();
    }

    // Edit, Complete, and Delete functionality
    taskList.addEventListener("click", function (e) {
        let li = e.target.closest("li");

        if (e.target.classList.contains("edit-btn")) {
            editTask(li);
        } else if (e.target.classList.contains("complete-btn")) {
            li.classList.toggle("completed");
        } else if (e.target.classList.contains("delete-btn")) {
            li.remove();
        }
        saveTasks();
    });

    function editTask(taskElement) {
        let taskText = taskElement.querySelector(".task-text").textContent;
        let [taskName, dateTime] = taskText.split(" - ");
        let [day, time] = dateTime.split(" @ ");

        taskInput.value = taskName;
        daySelect.value = day;
        taskTime.value = time;
        taskElement.remove();
    }

    function sortTasks() {
        let tasks = [...taskList.children];
        tasks.sort((a, b) => {
            let dateA = new Date(a.getAttribute("data-date") + " " + a.getAttribute("data-time"));
            let dateB = new Date(b.getAttribute("data-date") + " " + b.getAttribute("data-time"));
            return dateA - dateB;
        });

        taskList.innerHTML = "";
        tasks.forEach(task => taskList.appendChild(task));
    }

    function saveTasks() {
        localStorage.setItem("tasks", taskList.innerHTML);
    }

    function loadTasks() {
        if (localStorage.getItem("tasks")) {
            taskList.innerHTML = localStorage.getItem("tasks");
            sortTasks();
        }
    }

    // Google Login Callback Function
    function afterSignIn(response) {
        const responsePayload = decodeJwtResponse(response.credential);
        const name = responsePayload.name;
        const email = responsePayload.email;
        const userInfo = `Welcome, ${name}. Your email is ${email}.`;
        document.getElementById("prompt").textContent = userInfo;
        document.getElementById("signin-button").remove();

        const signOutButton = document.createElement("button");
        signOutButton.setAttribute("id", "signout-button");
        signOutButton.setAttribute("onclick", "afterSignOut()");
        signOutButton.textContent = "Sign Out";
        document.body.appendChild(signOutButton);

        // Send the ID token to the backend
        sendIdTokenToBackend(response.credential);

        // Redirect to todo.php after login
        window.location.href = "todo.php";
    }

    function decodeJwtResponse(token) {
        let base64Url = token.split(".")[1];
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        let jsonPayload = decodeURIComponent(
            atob(base64)
                .split(" ")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );
        return JSON.parse(jsonPayload);
    }

    function afterSignOut() {
        document.getElementById("prompt").textContent = signInPrompt;
        document.getElementById("signout-button").remove();
        const signInButton = document.createElement("div");
        signInButton.setAttribute("id", "signin-button");
        document.body.appendChild(signInButton);
        google.accounts.id.renderButton(
            document.getElementById("signin-button"),
            { theme: "outline", size: "large" }
        );
        google.accounts.id.disableAutoSelect();
    }

    // Send the ID Token to the backend
    function sendIdTokenToBackend(idToken) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "index.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            } else {
                console.error("Error sending ID token to backend");
            }
        };
        xhr.send("credential=" + idToken);
    }
});
