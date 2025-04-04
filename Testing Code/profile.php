<?php
// Initialize the session
session_start();

require 'db_connect.php'; // Include the connection file

// Check if the user is logged in, if not then redirect to login page
if (!isset($_SESSION['google_loggedin'])) {
    header('Location: login.php');
    exit;
}

// Retrieve session variables
$google_loggedin = $_SESSION['google_loggedin'];
$google_email = $_SESSION['google_email'];
$google_name = $_SESSION['google_name'];
$google_picture = $_SESSION['google_picture'];



// Default search term
$strToSearchOnGoogle = isset($_GET['SearchTerm']) ? $_GET['SearchTerm'] : 'Weather in MO';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PlanAI To-Do List</title>
    <link rel="stylesheet" type="text/css" href="style.css">

</head>
<body>

     <!-- Logout Button (Moved to the top right corner) -->
     <a href="logout.php" class="logout-btn">
        <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 
                6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 
                32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 
                32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 
                128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
            </svg>
        </span>
        Logout
    </a>

    <!-- Theme Toggle Button (Placed at the top) -->
    <button id="theme-toggle" class="theme-toggle">Toggle Theme</button>

    <div class="content home">
        <!-- Google Profile Section -->
        <div class="profile-picture">
            <img src="<?=$google_picture?>" alt="<?=$google_name?>" width="100" height="100">
        </div>

        <div class="profile-details">
            <div class="name">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 
                        482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                    </svg>
                </div>
                <div class="wrap">
                    <strong>Name</strong>
                    <span><?=$google_name?></span>
                </div>
            </div>

            <div class="email">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                        <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 
                        27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 
                        176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
                    </svg>
                </div>
                <div class="wrap">
                    <strong>Email</strong>
                    <span><?=$google_email?></span>
                </div>
            </div>
        </div>
    </div>

    <!-- To-Do List Section -->
    <div class="container">
        <h1>To-Do List</h1>

        <!-- Task input form -->
        <form id="task-form" action="add_task.php" method="POST">
            <label for="task-name">Task Name:</label>
            <input type="text" id="task-name" name="task_name" required>

            <label for="task-date">Task Date:</label>
            <input type="date" id="task-date" name="task_date" required>

            <label for="task-time">Task Time:</label>
            <input type="time" id="task-time" name="task_time" required>

            <button type="submit">Add Task</button>
        </form>

        <!-- Search bar -->
        <input type="text" id="search-bar" placeholder="Search tasks...">

        <!-- Task list -->
        <ul id="task-list"></ul>
    </div>

    <script src="tasks.js"></script>
</body>
</html>
