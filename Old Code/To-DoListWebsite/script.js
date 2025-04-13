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

    document.getElementById('prompt').textContent = `Welcome, ${name}. Your email is ${email}.`;
    document.getElementById('signin-button').remove();

    const signOutButton = document.createElement('button');
    signOutButton.id = 'signout-button';
    signOutButton.textContent = 'Sign Out';
    signOutButton.onclick = afterSignOut;
    document.body.appendChild(signOutButton);

    localStorage.setItem('user', JSON.stringify(responsePayload));

    // Load tasks from database
    if (typeof loadTasks === "function") {
        loadTasks();
    }
}

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
}

function afterSignOut() {
    document.getElementById('prompt').textContent = signInPrompt;
    document.getElementById('signout-button').remove();

    const signInButton = document.createElement('div');
    signInButton.id = 'signin-button';
    document.body.appendChild(signInButton);

    google.accounts.id.renderButton(signInButton, { theme: "outline", size: "large" });
    google.accounts.id.disableAutoSelect();

    localStorage.removeItem('user');

    // Clear task list (if used on this page)
    const taskList = document.getElementById("task-list");
    if (taskList) taskList.innerHTML = "";
}

// Theme toggle logic
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "light") {
        document.body.classList.add("light-theme");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            const theme = document.body.classList.contains("light-theme") ? "light" : "dark";
            localStorage.setItem("theme", theme);
        });
    }
});
