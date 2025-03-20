const signInPrompt = 'Please click the button below to log in using your Google account.';
const clientId = '998946007648-orlcfpteudvhiajo6bnv0jhvqmkbgt9t.apps.googleusercontent.com';

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
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const searchBar = document.getElementById("search-bar");
    const daySelect = document.getElementById("day-select");
    const taskTime = document.getElementById("task-time");

    initializeDropdown();

    // Generate dropdown with correct date order
    function initializeDropdown() {
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            let futureDate = new Date();
            futureDate.setDate(today.getDate() + i);
            let dayName = futureDate.toLocaleDateString("en-US", { weekday: "long" });
            let formattedDate = futureDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            let option = document.createElement("option");
            option.value = futureDate.toISOString().split("T")[0]; // Store as YYYY-MM-DD
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

    // Function to add a task with day and time
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

    // Sort tasks from soonest to farthest
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

    // Save tasks to localStorage
    function saveTasks() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            localStorage.setItem(`${user.email}_tasks`, taskList.innerHTML);
        }
    }

    // Load tasks from localStorage
    function loadTasks() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && localStorage.getItem(`${user.email}_tasks`)) {
            taskList.innerHTML = localStorage.getItem(`${user.email}_tasks`);
            sortTasks();
        }
    }
});



